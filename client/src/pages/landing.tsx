import { Link } from "wouter";
import { Heart, TrendingUp, Users, Megaphone, Trophy, ArrowRight, Zap, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const dimensions = [
  { icon: Heart, label: "Fan Attraction", desc: "How well you connect with and grow your supporter base" },
  { icon: TrendingUp, label: "Commercial", desc: "Sponsorship portfolio, revenue diversification, market capture" },
  { icon: Users, label: "Talent", desc: "Ability to attract, develop, and retain players and staff" },
  { icon: Megaphone, label: "Media & Cultural", desc: "Content reach, media visibility, and cultural relevance" },
  { icon: Trophy, label: "Competitive", desc: "On-field performance relative to resources invested" },
];

function ScasLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-label="SCAS Logo">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
      <path d="M14 24 L20 18 L26 24 L32 14 L34 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
      <circle cx="24" cy="24" r="3" fill="currentColor" className="text-primary" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <ScasLogo />
          <div>
            <span className="font-display font-bold text-base tracking-tight">SCAS</span>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Sports Club Attraction Score</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          <h1 className="font-display font-bold text-xl md:text-2xl leading-tight tracking-tight mb-4">
            How attractive is your sports club?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-lg">
            Measure your club's attraction potential across 5 key dimensions.
            Discover where you're strong, where you're leaving value on the table,
            and what to do about it.
          </p>

          {/* Two-path CTA cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Quick Score */}
            <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base">Quick Score</h2>
                  <span className="text-xs font-medium text-muted-foreground">Free</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                12 core questions across 5 dimensions. Get your directional SCAS score in under 3 minutes.
              </p>
              <Link href="/assess?mode=free">
                <Button variant="secondary" className="w-full gap-2" data-testid="button-start-free">
                  Start Free Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Premium Full Assessment */}
            <div className="rounded-lg border-2 border-primary bg-card p-6 flex flex-col relative">
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Recommended
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base">Full Assessment</h2>
                  <span className="text-xs font-medium text-primary">Premium · from €49</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                25–77 tier-specific questions with full breakdown, conversion rates, and recommendations.
              </p>
              <ul className="space-y-1.5 mb-6 flex-1">
                {[
                  "Full dimension breakdown",
                  "Conversion rate analysis",
                  "Actionable recommendations",
                  "Discount voucher equal to assessment fee",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/premium-gate">
                <Button className="w-full gap-2" data-testid="button-start-premium">
                  Start Premium Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="font-display font-semibold text-lg mb-6">Five Dimensions of Attraction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dim) => (
            <div
              key={dim.label}
              className="flex gap-4 p-4 rounded-md bg-card border border-card-border"
            >
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-primary/10">
                <dim.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-sm">{dim.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{dim.desc}</p>
              </div>
            </div>
          ))}

          {/* Summary card */}
          <div className="flex gap-4 p-4 rounded-md bg-primary/5 border border-primary/10">
            <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-primary/15">
              <Zap className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-semibold text-sm">Current vs. Potential</span>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                See your conversion rate — how much of your addressable potential you're capturing today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-display font-semibold text-lg mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Choose your path", desc: "Quick 12-question free score or comprehensive premium assessment with 25–77 questions." },
              { step: "02", title: "Get your SCAS score", desc: "Achieved score, potential ceiling, and conversion rate across all dimensions." },
              { step: "03", title: "Unlock recommendations", desc: "Specific initiative archetypes to close your biggest attraction gaps." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="font-display font-bold text-lg text-primary/30">{item.step}</span>
                <div>
                  <h3 className="font-display font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ScasLogo />
            <span>A <strong>Sports Disruption Institute</strong> Assessment — powered by <a href="https://powerplayone.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Powerplay One</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
