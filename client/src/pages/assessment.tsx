import { useState, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { STEPS, tierFromRevenue } from "@/lib/assessment-data";
import type { Step, Question } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Building2, Heart, TrendingUp, Users, Megaphone, Trophy } from "lucide-react";
import type { AssessmentSubmit } from "@shared/schema";

const ICON_MAP: Record<string, typeof Building2> = {
  Building2, Heart, TrendingUp, Users, Megaphone, Trophy,
};

// Read assessment mode from URL query params
// wouter's hash navigate puts search params in window.location.search
function getMode(): "free" | "premium" {
  // Check window.location.search first (wouter hash nav puts params here)
  let params = new URLSearchParams(window.location.search);
  let mode = params.get("mode");
  if (!mode) {
    // Fallback: check hash-based query params
    const hashParts = window.location.hash.split("?");
    params = new URLSearchParams(hashParts[1] || "");
    mode = params.get("mode");
  }
  return mode === "premium" ? "premium" : "free";
}

export default function Assessment() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<"right" | "left">("right");

  const mode = useMemo(() => getMode(), []);

  // In free mode, filter out steps that have no free-tier questions (except step 0 = Club Profile)
  const filteredSteps: Step[] = useMemo(() => {
    if (mode === "premium") return STEPS;
    return STEPS.map((step, idx) => {
      if (idx === 0) return step; // Club Profile always shown fully
      return {
        ...step,
        questions: step.questions.filter(q => q.freeTier === true),
      };
    }).filter(step => step.questions.length > 0);
  }, [mode]);

  const step = filteredSteps[currentStep];
  const totalSteps = filteredSteps.length;
  const StepIcon = ICON_MAP[step.icon] || Building2;

  // Derive the current tier from the annualRevenue answer
  const currentTier = useMemo(() => tierFromRevenue(answers), [answers]);

  const submitMutation = useMutation({
    mutationFn: async (data: AssessmentSubmit) => {
      const res = await apiRequest("POST", "/api/assessments", data);
      return res.json();
    },
    onSuccess: (data: { id: string }) => {
      setLocation(`/results/${data.id}`);
    },
  });

  const setAnswer = useCallback((id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  // Resolve the correct options for a question — tier-specific or default
  const resolveOptions = useCallback((question: Question) => {
    if (question.tierOptions && currentTier > 0) {
      return question.tierOptions[currentTier] || question.options || [];
    }
    return question.options || [];
  }, [currentTier]);

  // Filter visible questions: respect showWhen conditions AND minTier
  const visibleQuestions = useMemo(() => {
    return step.questions.filter(q => {
      // Check showWhen condition
      if (q.showWhen && !q.showWhen(answers)) return false;
      // Check minTier — only filter if a revenue is selected (tier > 0)
      if (q.minTier && q.minTier > 1 && currentTier < q.minTier) return false;
      return true;
    });
  }, [step.questions, answers, currentTier]);

  // Count total visible questions across ALL filtered steps for progress calculation
  const { totalQuestions, answeredQuestions } = useMemo(() => {
    let total = 0;
    let answered = 0;
    for (const s of filteredSteps) {
      for (const q of s.questions) {
        // Check showWhen
        if (q.showWhen && !q.showWhen(answers)) continue;
        // Check minTier
        if (q.minTier && q.minTier > 1 && currentTier < q.minTier) continue;
        total++;
        if (answers[q.id] && answers[q.id].trim() !== "") {
          answered++;
        }
      }
    }
    return { totalQuestions: total, answeredQuestions: answered };
  }, [answers, currentTier, filteredSteps]);

  // Progress based on answered questions
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const canProceed = visibleQuestions.every(q => {
    const val = answers[q.id];
    return val && val.trim() !== "";
  });

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection("right");
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit
      const submissionAnswers = { ...answers, _mode: mode };
      const data: AssessmentSubmit = {
        clubName: answers.clubName || "",
        sport: answers.sport || "",
        country: answers.country || "",
        league: answers.league,
        annualRevenue: answers.annualRevenue || "",
        answers: submissionAnswers,
        mode,
      };
      submitMutation.mutate(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection("left");
      setCurrentStep(prev => prev - 1);
    }
  };

  // Count answered questions in current step for the question counter
  const answeredInStep = visibleQuestions.filter(q => answers[q.id] && answers[q.id].trim() !== "").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-background sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-semibold text-sm text-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs text-muted-foreground">
              {step.title}
              {visibleQuestions.length > 0 && currentStep > 0 && (
                <> &middot; {answeredInStep} of {visibleQuestions.length} answered</>
              )}
            </span>
          </div>
          <Progress value={progress} className="h-1" data-testid="progress-bar" />
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 flex items-start justify-center pt-8 pb-24 px-6">
        <div
          key={currentStep}
          className={`w-full max-w-2xl ${direction === "right" ? "animate-slide-right" : "animate-slide-left"}`}
        >
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">{step.title}</h1>
              <p className="text-sm text-muted-foreground">{step.subtitle}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {visibleQuestions.map((question, qIdx) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-sm font-medium">
                  {currentStep > 0 && (
                    <span className="text-muted-foreground mr-1.5 text-xs font-normal">
                      {qIdx + 1}/{visibleQuestions.length}
                    </span>
                  )}
                  {question.label}
                </Label>
                {question.questionDescription && (
                  <p className="text-xs text-muted-foreground -mt-0.5">
                    {question.questionDescription}
                  </p>
                )}

                {question.type === "text" && (
                  <Input
                    value={answers[question.id] || ""}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    data-testid={`input-${question.id}`}
                  />
                )}

                {question.type === "select" && (question.options || question.tierOptions) && (
                  <Select
                    value={answers[question.id] || ""}
                    onValueChange={(val) => setAnswer(question.id, val)}
                  >
                    <SelectTrigger data-testid={`select-${question.id}`}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {resolveOptions(question).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === "radio-cards" && (question.options || question.tierOptions) && (() => {
                  const opts = resolveOptions(question);
                  return (
                  <div className={`grid gap-2 ${
                    opts.length <= 3
                      ? "grid-cols-1"
                      : opts.length <= 5
                      ? "grid-cols-2 sm:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3"
                  }`}>
                    {opts.map((opt) => {
                      const isSelected = answers[question.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswer(question.id, opt.value)}
                          className={`
                            relative text-left p-3 rounded-md border transition-colors
                            ${isSelected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/30"
                            }
                          `}
                          data-testid={`option-${question.id}-${opt.value}`}
                        >
                          <span className="text-sm font-medium block">{opt.label}</span>
                          {opt.description && (
                            <span className="text-xs text-muted-foreground block mt-0.5">{opt.description}</span>
                          )}
                          {opt.tooltip && (
                            <span className="text-[11px] text-muted-foreground/70 block mt-1 leading-tight">{opt.tooltip}</span>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed || submitMutation.isPending}
            className="gap-2"
            data-testid="button-next"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </>
            ) : currentStep === totalSteps - 1 ? (
              <>
                Get Results
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
