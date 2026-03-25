import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DIMENSION_META, TIER_PRICING } from "@/lib/assessment-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart, TrendingUp, Users, Megaphone, Trophy,
  Lock, ArrowRight, Zap, Target, Lightbulb, Clock, Flame,
  RotateCcw, MapPin, Globe, Shield, Check, Gift, Copy, CheckCheck,
  ChevronDown, ChevronUp, ArrowUpCircle, MinusCircle, ArrowDownCircle,
  Info, Ban
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import type { ScasScores, DimensionScore, Initiative, ScoreDriverEntry, DimensionDrivers, PotentialDriverEntry, DimensionPotentialDrivers } from "@shared/schema";
import { Link } from "wouter";

const ICONS: Record<string, typeof Heart> = { Heart, TrendingUp, Users, Megaphone, Trophy };

function ScoreRing({ score, maxScore = 5, size = 120, label }: { score: number; maxScore?: number; size?: number; label: string }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = score / maxScore;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="hsl(var(--muted))" strokeWidth="6"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-xl tabular-nums">{score.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground">/ {maxScore}</span>
      </div>
      <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

function DimensionBar({ dim, dimKey, unlocked, hideConversion, drivers, potentialDrivers }: { dim: DimensionScore; dimKey: string; unlocked: boolean; hideConversion?: boolean; drivers?: DimensionDrivers; potentialDrivers?: DimensionPotentialDrivers }) {
  const meta = DIMENSION_META[dimKey];
  const Icon = ICONS[meta.icon] || Heart;
  const achievedPct = (dim.achieved / 5) * 100;
  const potentialPct = (dim.potential / 5) * 100;

  return (
    <div className="p-4 rounded-md bg-card border border-card-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${meta.color}15` }}>
          <Icon className="w-4 h-4" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-semibold text-sm">{meta.label}</span>
            {meta.weight && <span className="text-xs text-muted-foreground">{meta.weight}</span>}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-6 rounded-sm bg-muted/50 overflow-hidden mb-2">
        {/* Potential (background) */}
        <div
          className="absolute inset-y-0 left-0 rounded-sm opacity-25"
          style={{
            width: `${potentialPct}%`,
            backgroundColor: meta.color,
            transition: "width 0.8s ease-out",
          }}
        />
        {/* Achieved (foreground) */}
        <div
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{
            width: `${achievedPct}%`,
            backgroundColor: meta.color,
            transition: "width 0.8s ease-out 0.2s",
          }}
        />
        {/* Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-white drop-shadow-sm tabular-nums">
            {dim.achieved.toFixed(1)}
          </span>
          <span className="text-xs text-foreground/60 tabular-nums">
            {dim.potential.toFixed(1)} potential
          </span>
        </div>
      </div>

      {/* Conversion rate + uplift */}
      {!hideConversion && (
        <div className="flex items-center justify-between gap-2">
          {unlocked ? (
            <>
              <span className="text-xs text-muted-foreground">
                Conversion: <span className="font-semibold text-foreground tabular-nums">{dim.conversionRate}%</span>
              </span>
              <span className="text-xs text-primary font-medium tabular-nums">
                +{dim.uplift.toFixed(1)} uplift available
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" /> Conversion rate
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" /> Detailed breakdown
              </span>
            </>
          )}
        </div>
      )}

      {/* Score Drivers (premium unlocked only) */}
      {unlocked && drivers && (
        <ScoreDriversPanel drivers={drivers} dimKey={dimKey} />
      )}

      {/* Potential Drivers (premium unlocked only) */}
      {unlocked && potentialDrivers && (
        <PotentialDriversPanel drivers={potentialDrivers} dimKey={dimKey} />
      )}

      {/* Free mode: blurred potential drivers teaser */}
      {!unlocked && hideConversion && (
        <div className="mt-3 relative">
          <div className="blur-[2px] pointer-events-none select-none opacity-40">
            <div className="flex items-center gap-2 text-xs font-medium text-primary/80 w-full">
              <ChevronDown className="w-3.5 h-3.5" />
              Potential Drivers
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UpsellCard() {
  return (
    <Card className="p-6 border-primary/20 bg-primary/3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base">Want the full picture?</h3>
          <p className="text-xs text-muted-foreground">Upgrade to the premium assessment for complete insights</p>
        </div>
      </div>
      <ul className="space-y-2 mb-5">
        {[
          "Conversion rate analysis for each dimension",
          "Detailed per-question breakdown",
          "Tailored recommendations and initiative archetypes",
          "Discount voucher equal to your assessment fee",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link href="/premium-gate">
        <Button className="w-full gap-2" data-testid="button-upgrade-premium">
          Upgrade to Full Assessment
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </Card>
  );
}

function VoucherSection({ voucherCode, tier }: { voucherCode: string; tier: number }) {
  const tierData = TIER_PRICING[tier];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="p-6 border-primary/20 bg-primary/3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base">Your €{tierData?.price ?? 49} Voucher</h3>
          <p className="text-xs text-muted-foreground">Worth €{tierData?.price ?? 49} — redeemable on any Powerplay One service</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-muted/50 rounded-md px-4 py-3 font-mono text-base font-semibold tracking-wider text-center" data-testid="text-voucher-code">
          {voucherCode}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5" data-testid="button-copy-voucher">
          {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">How to redeem</p>
        <ol className="text-xs text-muted-foreground leading-relaxed space-y-1 list-decimal list-inside">
          <li>Visit <a href="https://powerplayone.com/redeem" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-primary">powerplayone.com/redeem</a></li>
          <li>Enter your voucher code</li>
          <li>Applied as discount at checkout</li>
        </ol>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Redeemable on any Powerplay One workshop, consulting engagement, or SIRA/SIFA platform subscription.
        </p>
        <p className="text-xs text-muted-foreground/70 leading-relaxed mt-2">
          Valid for 12 months from assessment completion. Single use, non-transferable, not redeemable for cash. Valid on all Powerplay One services with a value equal to or greater than the voucher amount.
        </p>
      </div>
    </Card>
  );
}

// ─── Score Drivers Panel ────────────────────────────────────────────────────
const SIGNAL_CONFIG = {
  boosting: {
    icon: ArrowUpCircle,
    label: "Boosting",
    prefix: "\u25B2",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  neutral: {
    icon: MinusCircle,
    label: "Neutral",
    prefix: "\u2014",
    textColor: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  dragging: {
    icon: ArrowDownCircle,
    label: "Dragging",
    prefix: "\u25BC",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

function ScoreDriversPanel({ drivers, dimKey }: { drivers: DimensionDrivers; dimKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const meta = DIMENSION_META[dimKey];

  if (!drivers || drivers.entries.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors w-full"
        data-testid={`button-score-drivers-${dimKey}`}
      >
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        Score Drivers
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Summary */}
          <p className="text-xs text-muted-foreground leading-relaxed px-1">
            {drivers.summary}
          </p>

          {/* Per-question entries */}
          <div className="space-y-1.5">
            {drivers.entries.map((entry) => {
              const cfg = SIGNAL_CONFIG[entry.signal];
              const SignalIcon = cfg.icon;
              return (
                <div
                  key={entry.questionId}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-md border ${cfg.bgColor} ${cfg.borderColor}`}
                >
                  <SignalIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.textColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {entry.questionLabel}
                      </span>
                      <span className={`text-xs font-medium whitespace-nowrap ${cfg.textColor}`}>
                        {cfg.prefix} {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        Answer: <span className="font-medium text-foreground">{entry.answer}</span>
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        ({entry.score.toFixed(1)}/5.0)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {entry.implication}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Potential Drivers Panel ─────────────────────────────────────────────────
const POTENTIAL_SIGNAL_CONFIG = {
  boosting: {
    icon: ArrowUpCircle,
    label: "Boosting",
    prefix: "\u25B2",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  neutral: {
    icon: MinusCircle,
    label: "Neutral",
    prefix: "\u2014",
    textColor: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  dragging: {
    icon: ArrowDownCircle,
    label: "Constraining",
    prefix: "\u25BC",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  info: {
    icon: Info,
    label: "Context",
    prefix: "\u2139",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  na: {
    icon: Ban,
    label: "N/A",
    prefix: "\u2014",
    textColor: "text-slate-400",
    bgColor: "bg-slate-50/50",
    borderColor: "border-slate-100",
  },
};

function PotentialDriversPanel({ drivers, dimKey }: { drivers: DimensionPotentialDrivers; dimKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const meta = DIMENSION_META[dimKey];

  if (!drivers || drivers.entries.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-primary/80 hover:text-primary transition-colors w-full"
        data-testid={`button-potential-drivers-${dimKey}`}
      >
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        Potential Drivers
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Summary */}
          <p className="text-xs text-muted-foreground leading-relaxed px-1">
            {drivers.summary}
          </p>

          {/* Per-factor entries */}
          <div className="space-y-1.5">
            {drivers.entries.map((entry) => {
              const cfg = POTENTIAL_SIGNAL_CONFIG[entry.signal];
              const SignalIcon = cfg.icon;
              return (
                <div
                  key={entry.factor}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-md border ${cfg.bgColor} ${cfg.borderColor} ${entry.signal === "na" ? "opacity-60" : ""}`}
                >
                  <SignalIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.textColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {entry.label}
                      </span>
                      <span className={`text-xs font-medium whitespace-nowrap ${cfg.textColor}`}>
                        {cfg.prefix} {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {entry.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function InitiativeCard({ initiative }: { initiative: Initiative }) {
  return (
    <div className="flex gap-3 p-3 rounded-md bg-card border border-card-border">
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
        <Lightbulb className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-display font-semibold text-sm block">{initiative.name}</span>
        <span className="text-xs text-muted-foreground block mt-0.5">{initiative.dimension}</span>
        {initiative.reason && (
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed bg-muted/30 rounded px-2 py-1.5">
            <span className="font-medium text-foreground">Why recommended:</span> {initiative.reason}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="text-xs flex items-center gap-1 text-primary">
            <Target className="w-3 h-3" /> {initiative.impactRange}
          </span>
          <span className="text-xs flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" /> {initiative.timeline}
          </span>
          <span className="text-xs flex items-center gap-1 text-muted-foreground">
            <Flame className="w-3 h-3" /> {initiative.effort}
          </span>
        </div>
      </div>
    </div>
  );
}

function UnlockForm({ assessmentId, onUnlocked, leadEmail, leadName, leadRole }: { assessmentId: string; onUnlocked: () => void; leadEmail?: string | null; leadName?: string | null; leadRole?: string | null }) {
  const hasPrefilledData = !!(leadEmail && leadName);
  const [email, setEmail] = useState(leadEmail || "");
  const [contactName, setContactName] = useState(leadName || "");
  const [orgRole, setOrgRole] = useState(leadRole || "");

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/assessments/${assessmentId}/unlock`, {
        email, contactName, orgRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", assessmentId] });
      onUnlocked();
    },
  });

  // One-click pre-filled confirmation for premium users
  if (hasPrefilledData) {
    return (
      <Card className="p-6 border-primary/20 bg-primary/3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base">Unlock Your Full Report</h3>
            <p className="text-xs text-muted-foreground">Confirm to access conversion rates, score drivers, and tailored recommendations</p>
          </div>
        </div>
        <div className="rounded-md bg-muted/50 p-3 mb-4 space-y-1">
          <p className="text-sm"><span className="text-muted-foreground">Name:</span> <span className="font-medium">{leadName}</span></p>
          <p className="text-sm"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{leadEmail}</span></p>
          {leadRole && <p className="text-sm"><span className="text-muted-foreground">Role:</span> <span className="font-medium">{leadRole}</span></p>}
        </div>
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full gap-2"
          data-testid="button-unlock"
        >
          {mutation.isPending ? "Unlocking..." : "Confirm & Unlock Full Report"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  // Fallback form for free-to-premium upgrade (no pre-filled data)
  return (
    <Card className="p-6 border-primary/20 bg-primary/3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base">Unlock Full Report</h3>
          <p className="text-xs text-muted-foreground">Get conversion rates, detailed breakdowns, and tailored recommendations</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@club.com"
            data-testid="input-unlock-email"
          />
        </div>
        <div>
          <Label className="text-sm">Your Name</Label>
          <Input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Full name"
            data-testid="input-unlock-name"
          />
        </div>
        <div>
          <Label className="text-sm">Role</Label>
          <Input
            value={orgRole}
            onChange={(e) => setOrgRole(e.target.value)}
            placeholder="e.g., CEO, Commercial Director"
            data-testid="input-unlock-role"
          />
        </div>
        <Button
          onClick={() => mutation.mutate()}
          disabled={!email || !contactName || !orgRole || mutation.isPending}
          className="w-full gap-2"
          data-testid="button-unlock"
        >
          {mutation.isPending ? "Unlocking..." : "Unlock Full Report"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function Results() {
  const [, params] = useRoute("/results/:id");
  const id = params?.id || "";
  const [unlocked, setUnlocked] = useState(false);

  const { data, isLoading, error } = useQuery<{
    clubName: string;
    sport: string;
    country: string;
    tier: number;
    scores: ScasScores;
    unlocked: boolean;
    mode: string;
    voucherCode: string | null;
    leadEmail: string | null;
    leadName: string | null;
    leadRole: string | null;
  }>({
    queryKey: ["/api/assessments", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-lg mb-2">Assessment not found</h1>
          <p className="text-sm text-muted-foreground mb-4">This assessment may have expired or doesn't exist.</p>
          <Link href="/">
            <Button variant="secondary" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Start New Assessment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { scores } = data;
  const assessmentMode = data.mode || "free";
  const isFreeMode = assessmentMode === "free";
  const isUnlocked = data.unlocked || unlocked;

  // Radar chart data
  const radarData = [
    { dimension: "Fan", achieved: scores.dimensions.fan.achieved, potential: scores.dimensions.fan.potential },
    { dimension: "Commercial", achieved: scores.dimensions.commercial.achieved, potential: scores.dimensions.commercial.potential },
    { dimension: "Talent", achieved: scores.dimensions.talent.achieved, potential: scores.dimensions.talent.potential },
    { dimension: "Media", achieved: scores.dimensions.media.achieved, potential: scores.dimensions.media.potential },
    { dimension: "Competitive", achieved: scores.dimensions.competitive.achieved, potential: scores.dimensions.competitive.potential },
  ];

  const tierLabels: Record<number, string> = {
    1: "Grassroots", 2: "Foundation", 3: "Challenger", 4: "Contender", 5: "Elite"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-base">{data.clubName}</h1>
            <p className="text-xs text-muted-foreground">{data.sport} &middot; {data.country}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge variant="secondary" className="font-display">
              T{scores.tier} {tierLabels[scores.tier]}
            </Badge>
            {scores.catchmentContext && (
              <Badge variant="outline" className="gap-1 text-muted-foreground font-normal">
                <MapPin className="w-3 h-3" />
                {scores.catchmentContext.population} pop.
              </Badge>
            )}
            {scores.catchmentContext?.internationalReach && scores.catchmentContext.internationalReach !== "local" && scores.tier >= 3 && (
              <Badge variant="outline" className="gap-1 text-muted-foreground font-normal">
                <Globe className="w-3 h-3" />
                {scores.catchmentContext.internationalReach === "international" ? "International" : "National"} reach
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Score */}
        <section className="flex flex-col md:flex-row items-center gap-8">
          <ScoreRing score={scores.overall.achieved} label="Overall SCAS Score" size={140} />

          <div className="flex-1 text-center md:text-left">
            <Badge variant="default" className="mb-2 font-display">{scores.ratingBand}</Badge>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-3">
              <div>
                <span className="text-xs text-muted-foreground block">Potential</span>
                <span className="font-display font-bold text-lg tabular-nums">{scores.overall.potential.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Uplift Available</span>
                <span className="font-display font-bold text-lg text-primary tabular-nums">+{scores.overall.uplift.toFixed(2)}</span>
              </div>
              {!isFreeMode && isUnlocked && (
                <div>
                  <span className="text-xs text-muted-foreground block">Conversion Rate</span>
                  <span className="font-display font-bold text-lg tabular-nums">{scores.overall.conversionRate}%</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Biggest opportunity: <span className="text-foreground font-medium">{scores.biggestOpportunity}</span>
              </span>
            </div>
            {scores.catchmentContext && scores.catchmentContext.catchmentMultiplier < 1.0 && (
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Catchment area ({scores.catchmentContext.population}) moderates potential ceiling for audience-dependent dimensions
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Radar Chart */}
        <section>
          <h2 className="font-display font-semibold text-base mb-4">Attraction Profile</h2>
          <Card className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickCount={6}
                />
                <Radar
                  name="Potential"
                  dataKey="potential"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <Radar
                  name="Achieved"
                  dataKey="achieved"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary" />
                <span className="text-xs text-muted-foreground">Achieved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary/10 border border-primary border-dashed" />
                <span className="text-xs text-muted-foreground">Potential</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Dimension Breakdown */}
        <section>
          <h2 className="font-display font-semibold text-base mb-4">Dimension Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(scores.dimensions) as [string, DimensionScore][]).map(([key, dim]) => (
              <DimensionBar
                key={key}
                dimKey={key}
                dim={dim}
                unlocked={isUnlocked}
                hideConversion={isFreeMode}
                drivers={scores.scoreDrivers?.[key]}
                potentialDrivers={scores.potentialDrivers?.[key]}
              />
            ))}
          </div>
        </section>

        {/* Free mode: upsell card */}
        {isFreeMode && (
          <section>
            <UpsellCard />
          </section>
        )}

        {/* Non-free mode: Unlock or Premium Content */}
        {!isFreeMode && (
          <>
            {!isUnlocked ? (
              <section>
                <UnlockForm
                  assessmentId={id}
                  onUnlocked={() => setUnlocked(true)}
                  leadEmail={data.leadEmail}
                  leadName={data.leadName}
                  leadRole={data.leadRole}
                />
              </section>
            ) : (
              <>
                <section>
                  <h2 className="font-display font-semibold text-base mb-4">Recommended Initiatives</h2>
                  {scores.initiatives.length > 0 ? (
                    <div className="space-y-3">
                      {scores.initiatives.map((init, i) => (
                        <InitiativeCard key={i} initiative={init} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Your scores are strong across all dimensions. Focus on maintaining your competitive advantages.
                    </p>
                  )}
                </section>

                {/* Voucher section for premium */}
                {data.voucherCode && (
                  <section>
                    <VoucherSection voucherCode={data.voucherCode} tier={scores.tier} />
                  </section>
                )}

                {/* Premium+ Teaser */}
                <section>
                  <Card className="p-5 border-dashed border-primary/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-sm">Premium+ Deep-Dive</h3>
                        <span className="text-xs text-muted-foreground">Coming soon</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      Implementation playbooks, peer benchmarking against similar clubs, and a prioritised improvement roadmap — tailored to your tier and dimension gaps.
                    </p>
                    <a href="https://powerplayone.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2" data-testid="button-premium-plus-interest">
                        Register Interest
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </Card>
                </section>
              </>
            )}
          </>
        )}

        {/* CTA */}
        <section className="text-center py-6">
          {isFreeMode ? (
            <p className="text-sm text-muted-foreground mb-3">
              This was your quick score based on 12 core questions. Upgrade to the full assessment for complete insights.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              Want to dive deeper? The full SCAS assessment with 50+ questions and peer benchmarking is available through Powerplay One.
            </p>
          )}
          <div className="flex items-center justify-center gap-3">
            {isFreeMode ? (
              <Link href="/premium-gate">
                <Button variant="default" className="gap-2" data-testid="button-cta-upgrade">
                  Upgrade to Full Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <a href="https://powerplayone.com" target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="gap-2">
                  Learn About Powerplay One
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            )}
            <Link href="/">
              <Button variant="secondary" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                New Assessment
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            A <strong>Sports Disruption Institute</strong> Assessment — powered by <a href="https://powerplayone.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Powerplay One</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
