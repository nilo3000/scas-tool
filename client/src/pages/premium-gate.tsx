import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TIER_PRICING } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Shield, Check, Loader2, Gift, Sparkles } from "lucide-react";

export default function PremiumGate() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/premium-leads", {
        name,
        email,
        organization,
        role,
        selectedTier: selectedTier,
      });
    },
    onSuccess: () => {
      setLocation("/assess?mode=premium");
    },
  });

  const canSubmit = name.trim() && email.trim() && organization.trim() && role.trim();
  const tier = selectedTier ? TIER_PRICING[selectedTier] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          {step === 1 ? (
            <Link href="/">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </Link>
          ) : (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back-step"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* ─── STEP 1: Tier Selection ─── */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-xl mb-2" data-testid="text-premium-title">
                Choose Your Club Tier
              </h1>
              <p className="text-sm text-muted-foreground">
                Assessment pricing is based on your club's annual revenue
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(TIER_PRICING).map(([key, t]) => {
                const tierNum = Number(key);
                const isSelected = selectedTier === tierNum;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTier(tierNum);
                      setStep(2);
                    }}
                    className={`text-left rounded-lg border-2 bg-card p-5 transition-colors hover:border-primary ${
                      isSelected ? "border-primary" : "border-border"
                    }`}
                    data-testid={`card-tier-${tierNum}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="font-display text-xs">
                        T{tierNum}
                      </Badge>
                      <span className="font-display font-semibold text-sm">{t.tierLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{t.revenueRange}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="font-display font-bold text-xl">€{t.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{t.questions} questions</p>
                    <p className="text-xs text-primary font-medium">Includes €{t.price} voucher</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STEP 2: Bundle Overview ─── */}
        {step === 2 && tier && selectedTier && (
          <div>
            <div className="mb-8">
              <h1 className="font-display font-bold text-xl mb-2" data-testid="text-bundle-title">
                Your {tier.tierLabel} Assessment
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl">€{tier.price}</span>
                <span className="text-sm text-muted-foreground">one-time assessment fee</span>
              </div>
            </div>

            {/* What's included */}
            <Card className="p-5 mb-6 border-primary/20 bg-primary/3">
              <h2 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                What's included
              </h2>
              <ul className="space-y-2">
                {[
                  `${tier.questions} tier-specific questions across 5 dimensions`,
                  "Full Achieved vs. Potential scoring",
                  "Conversion rate analysis for each dimension",
                  "Detailed per-question breakdown",
                  "Tailored recommendations and initiative archetypes",
                  `€${tier.price} discount voucher for Powerplay One workshops, consulting, or SIRA/SIFA platform`,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Coming soon note */}
            <Card className="p-4 mb-8 border-dashed border-primary/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary/50" />
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">Coming soon</span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Premium+ deep-dive recommendations with implementation playbooks
                  </p>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => setStep(3)}
              className="w-full gap-2"
              size="lg"
              data-testid="button-continue-payment"
            >
              Continue to Payment
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ─── STEP 3: Contact & Payment ─── */}
        {step === 3 && tier && selectedTier && (
          <div>
            <h1 className="font-display font-bold text-xl mb-4" data-testid="text-payment-title">
              Complete Your Purchase
            </h1>

            {/* Pricing summary badge */}
            <Badge variant="secondary" className="font-display mb-6 text-sm px-3 py-1">
              T{selectedTier} {tier.tierLabel} · €{tier.price}
            </Badge>

            {/* Form */}
            <div className="space-y-4 mt-6">
              <div className="space-y-1.5">
                <Label className="text-sm">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  data-testid="input-premium-name"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@club.com"
                  data-testid="input-premium-email"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Organization</Label>
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Club or organization name"
                  data-testid="input-premium-organization"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., CEO, Commercial Director"
                  data-testid="input-premium-role"
                />
              </div>

              {/* Payment note */}
              <Card className="p-4 border-primary/20 bg-primary/3">
                <div className="flex items-start gap-3">
                  <Gift className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your assessment fee of <span className="font-semibold text-foreground">€{tier.price}</span> includes a voucher of equal value, redeemable on any Powerplay One service — making the assessment effectively free.
                  </p>
                </div>
              </Card>

              <Button
                onClick={() => submitMutation.mutate()}
                disabled={!canSubmit || submitMutation.isPending}
                className="w-full gap-2 mt-2"
                size="lg"
                data-testid="button-proceed-premium"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete & Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-2">
                Your information will be used to deliver your assessment results and voucher.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
