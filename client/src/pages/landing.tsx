import { Link } from "wouter";
import { Heart, TrendingUp, Users, Megaphone, Trophy, ArrowRight, Zap, Shield, Check, Target, BarChart3, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

const dimensions = [
  { icon: Heart, label: "Fan Attraction", desc: "Community engagement, fan database, matchday experience, supporter growth" },
  { icon: TrendingUp, label: "Commercial", desc: "Sponsorship portfolio, revenue diversification, digital monetization" },
  { icon: Users, label: "Talent", desc: "Player recruitment, coaching quality, academy pathways, retention" },
  { icon: Megaphone, label: "Media & Cultural", desc: "Content output, media visibility, brand consistency, cultural relevance" },
  { icon: Trophy, label: "Competitive", desc: "On-field performance efficiency, analytics maturity, strategic alignment" },
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
            <span className="font-display font-bold text-base tracking-tight">SCAS 360</span>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Sports Club Attraction Score</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-4">The Sports Disruption Institute</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl leading-tight tracking-tight mb-5">
            Your club has a ceiling.<br />Do you know where it is?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-4 max-w-xl">
            Most sports clubs capture less than 60% of their addressable commercial potential. 
            The gap between where your club is and where it could be has a number. SCAS 360 finds it.
          </p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed mb-10 max-w-xl">
            One assessment. Five strategic dimensions. A score calibrated to your tier, your catchment, 
            and your sport — not someone else's. Walk away with a clear picture of what's holding your 
            club back and the highest-impact actions to fix it.
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
                  <span className="text-xs font-medium text-muted-foreground">Free &middot; 3 minutes</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                12 core questions. Get your directional SCAS score, see your rating band, and discover your biggest opportunity area.
              </p>
              <ul className="space-y-1.5 mb-6 flex-1">
                {[
                  "Overall attraction score",
                  "Per-dimension snapshot",
                  "Rating band & biggest gap",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
                  <span className="text-xs font-medium text-primary">Premium &middot; from &euro;49</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                32&ndash;83 tier-specific questions. The complete diagnostic — your score, your ceiling, and a roadmap to close the gap.
              </p>
              <ul className="space-y-1.5 mb-6 flex-1">
                {[
                  "Current vs. Potential across all 5 dimensions",
                  "Score Drivers — what's boosting and dragging you",
                  "Conversion rate: % of potential you're capturing",
                  "Prioritized initiative recommendations",
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

      {/* What you get */}
      <section className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="font-display font-semibold text-lg mb-2">What you'll discover</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg">
            SCAS 360 doesn't just tell you where you stand — it shows you the realistic ceiling your club could reach and exactly what's standing between you and it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Your Attraction Score", desc: "A single number across five dimensions, benchmarked against clubs at your level — not elite standards you can't compare to." },
              { icon: BarChart3, title: "Current vs. Potential", desc: "See not just where you are, but what's realistically achievable. Your conversion rate shows exactly how much headroom you have." },
              { icon: Route, title: "Prioritized Roadmap", desc: "Specific initiatives matched to your tier and resources. Grassroots clubs get low-cost actions. Professional clubs get strategic plays." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-primary/10">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
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
                <span className="font-display font-semibold text-sm">{dim.label}</span>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{dim.desc}</p>
              </div>
            </div>
          ))}

          {/* Calibrated card */}
          <div className="flex gap-4 p-4 rounded-md bg-primary/5 border border-primary/10">
            <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-primary/15">
              <Zap className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-semibold text-sm">Calibrated for Your Level</span>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                A grassroots club is benchmarked against grassroots peers — never against elite standards. Every score reflects what's realistically achievable at your tier.
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
              { step: "01", title: "Choose your path", desc: "Free Quick Score in 3 minutes or the full Premium Assessment (30–90 min depending on tier)." },
              { step: "02", title: "Get your SCAS score", desc: "Achieved score, potential ceiling, and conversion rate — all calibrated to your tier, catchment, and sport." },
              { step: "03", title: "Act on the roadmap", desc: "Prioritized initiatives matched to your resources and stage. Every recommendation is actionable from day one." },
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

      {/* Social proof / credibility */}
      <section className="border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
              "We built SCAS 360 because we kept having the same conversation with clubs at every level — they knew they were underperforming, 
              but had no systematic way to see exactly where or by how much."
            </p>
            <p className="text-xs text-muted-foreground/70">
              The Sports Disruption Institute — built on years of work with top sports organizations worldwide
            </p>
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
