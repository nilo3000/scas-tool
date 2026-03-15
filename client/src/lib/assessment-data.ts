export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  tooltip?: string;  // Per-answer tooltip text
}

export interface Question {
  id: string;
  label: string;
  type: "select" | "text" | "radio-cards";
  options?: QuestionOption[];
  /** Tier-specific option overrides — if present, use these instead of `options` based on club tier */
  tierOptions?: Record<number, QuestionOption[]>;
  placeholder?: string;
  /** Only show this question when condition returns true (receives current answers) */
  showWhen?: (answers: Record<string, string>) => boolean;
  /** Minimum tier required to show this question (1-5). Defaults to 1 if omitted. */
  minTier?: number;
  /** Whether this question is included in the free tier assessment */
  freeTier?: boolean;
  /** Question-level description: always visible, explains what's measured and why */
  questionDescription?: string;
}

export interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name
  questions: Question[];
}

export const SPORTS = [
  "Football", "Basketball", "Handball", "Ice Hockey", "Rugby",
  "Cricket", "Baseball", "American Football", "Tennis", "Volleyball", "Other"
];

export const REVENUE_RANGES = [
  { value: "Under $3M", label: "Under $3M", tier: 1, tierLabel: "Grassroots" },
  { value: "$3M-$10M", label: "$3M – $10M", tier: 2, tierLabel: "Foundation" },
  { value: "$10M-$50M", label: "$10M – $50M", tier: 3, tierLabel: "Challenger" },
  { value: "$50M-$300M", label: "$50M – $300M", tier: 4, tierLabel: "Contender" },
  { value: "Over $300M", label: "Over $300M", tier: 5, tierLabel: "Elite" },
];

export const TIER_PRICING: Record<number, { price: number; tierLabel: string; revenueRange: string; questions: string }> = {
  1: { price: 19, tierLabel: "Grassroots", revenueRange: "Under $3M", questions: "~25" },
  2: { price: 49, tierLabel: "Foundation", revenueRange: "$3M – $10M", questions: "~36" },
  3: { price: 99, tierLabel: "Challenger", revenueRange: "$10M – $50M", questions: "~56" },
  4: { price: 159, tierLabel: "Contender", revenueRange: "$50M – $300M", questions: "~69" },
  5: { price: 490, tierLabel: "Elite", revenueRange: "Over $300M", questions: "~77" },
};

/** Derive numeric tier from the annualRevenue answer value */
export function tierFromRevenue(answers: Record<string, string>): number {
  const rev = answers.annualRevenue;
  const match = REVENUE_RANGES.find(r => r.value === rev);
  return match ? match.tier : 1;
}

export const STEPS: Step[] = [
  // ─── STEP 0: CLUB PROFILE ────────────────────────────────────────────
  {
    id: "profile",
    title: "Club Profile",
    subtitle: "Tell us about your organization",
    icon: "Building2",
    questions: [
      {
        id: "clubName",
        label: "Club / Organization Name",
        type: "text",
        placeholder: "e.g., FC Rheinstrom",
      },
      {
        id: "sport",
        label: "Primary Sport",
        type: "select",
        options: SPORTS.map(s => ({ value: s, label: s })),
      },
      {
        id: "country",
        label: "Country",
        type: "text",
        placeholder: "e.g., Germany",
      },
      {
        id: "annualRevenue",
        label: "Annual Revenue Range",
        type: "radio-cards",
        options: REVENUE_RANGES.map(r => ({
          value: r.value,
          label: r.label,
          description: `Tier ${r.tier}: ${r.tierLabel}`,
        })),
      },
      {
        id: "catchmentPopulation",
        label: "Population of your primary catchment area (city/town/region)",
        type: "radio-cards",
        options: [
          { value: "<10K", label: "Under 10,000", description: "Village / rural area" },
          { value: "10K-50K", label: "10K – 50K", description: "Small town" },
          { value: "50K-150K", label: "50K – 150K", description: "Mid-size town" },
          { value: "150K-500K", label: "150K – 500K", description: "City" },
          { value: "500K-1M", label: "500K – 1M", description: "Large city" },
          { value: "1M+", label: "Over 1M", description: "Major metro" },
        ],
      },
      {
        id: "internationalReach",
        label: "Does your club have a significant national or international following?",
        type: "radio-cards",
        showWhen: (answers) => {
          const rev = answers.annualRevenue;
          return rev === "$10M-$50M" || rev === "$50M-$300M" || rev === "Over $300M";
        },
        options: [
          { value: "local", label: "Mostly local/regional", description: "Fans are primarily from the immediate area" },
          { value: "national", label: "National presence", description: "Significant following across the country" },
          { value: "international", label: "International brand", description: "Meaningful international fanbase or diaspora following" },
        ],
      },
    ],
  },

  // ─── STEP 1: FAN ATTRACTION (30%) ────────────────────────────────────
  {
    id: "fan",
    title: "Fan Attraction",
    subtitle: "Your connection with supporters and community",
    icon: "Heart",
    questions: [
      // === Core (T1+) ===
      {
        id: "socialFollowers",
        label: "Total social media followers (all platforms)",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        questionDescription: "Combined follower count across all social media platforms. Different ranges apply based on your club's tier.",
        tierOptions: {
          1: [
            { value: "<500", label: "<500" },
            { value: "500-2K", label: "500 – 2K" },
            { value: "2K-10K", label: "2K – 10K" },
            { value: "10K-50K", label: "10K – 50K" },
            { value: "50K-200K", label: "50K – 200K" },
            { value: "200K+", label: "200K+" },
          ],
          2: [
            { value: "<2K", label: "<2K" },
            { value: "2K-10K", label: "2K – 10K" },
            { value: "10K-50K", label: "10K – 50K" },
            { value: "50K-200K", label: "50K – 200K" },
            { value: "200K-750K", label: "200K – 750K" },
            { value: "750K+", label: "750K+" },
          ],
          3: [
            { value: "<10K", label: "<10K" },
            { value: "10K-50K", label: "10K – 50K" },
            { value: "50K-250K", label: "50K – 250K" },
            { value: "250K-750K", label: "250K – 750K" },
            { value: "750K-2M", label: "750K – 2M" },
            { value: "2M+", label: "2M+" },
          ],
          4: [
            { value: "<100K", label: "<100K" },
            { value: "100K-500K", label: "100K – 500K" },
            { value: "500K-2M", label: "500K – 2M" },
            { value: "2M-10M", label: "2M – 10M" },
            { value: "10M-50M", label: "10M – 50M" },
            { value: "50M+", label: "50M+" },
          ],
          5: [
            { value: "<1M", label: "<1M" },
            { value: "1M-5M", label: "1M – 5M" },
            { value: "5M-20M", label: "5M – 20M" },
            { value: "20M-80M", label: "20M – 80M" },
            { value: "80M-250M", label: "80M – 250M" },
            { value: "250M+", label: "250M+" },
          ],
        },
      },
      {
        id: "attendanceCapacity",
        label: "Average matchday attendance as % of venue capacity",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        questionDescription: "Percentage of available seats filled on a typical matchday. Different tiers have different expectations — 85%+ is outstanding for a grassroots club but average for an elite one.",
        tierOptions: {
          1: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-70%", label: "50 – 70%" },
            { value: "70-85%", label: "70 – 85%" },
            { value: "85-92%", label: "85 – 92%" },
          ],
          2: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-70%", label: "50 – 70%" },
            { value: "70-85%", label: "70 – 85%" },
            { value: "85-92%", label: "85 – 92%" },
          ],
          3: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-70%", label: "50 – 70%" },
            { value: "70-85%", label: "70 – 85%" },
            { value: "85-92%", label: "85 – 92%" },
            { value: "92%+", label: "92%+" },
          ],
          4: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-70%", label: "50 – 70%" },
            { value: "70-85%", label: "70 – 85%" },
            { value: "85-92%", label: "85 – 92%" },
            { value: "92%+", label: "92%+" },
          ],
          5: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-70%", label: "50 – 70%" },
            { value: "70-85%", label: "70 – 85%" },
            { value: "85-92%", label: "85 – 92%" },
            { value: "92%+", label: "92%+" },
          ],
        },
      },
      {
        id: "fanDatabase",
        label: "Do you have a system tracking known fans?",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No", label: "No" },
          { value: "Basic spreadsheet", label: "Basic spreadsheet" },
          { value: "Dedicated CRM", label: "Dedicated CRM" },
          { value: "Advanced with segmentation", label: "Advanced CRM with segmentation" },
        ],
      },
      // === T1+ additions ===
      {
        id: "activeMembersCount",
        label: "How many active members or supporters does your club have?",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        questionDescription: "Total active members, season ticket holders, or registered supporters. Tier-adjusted — a T1 club with 5K members is outstanding, while a T5 club needs 150K+ to score highly.",
        tierOptions: {
          1: [
            { value: "<50", label: "Under 50" },
            { value: "100-500", label: "100 – 500" },
            { value: "500-2K", label: "500 – 2K" },
            { value: "2K-5K", label: "2K – 5K" },
            { value: "5K-15K", label: "5K – 15K" },
          ],
          2: [
            { value: "<100", label: "Under 100" },
            { value: "100-500", label: "100 – 500" },
            { value: "500-2K", label: "500 – 2K" },
            { value: "2K-5K", label: "2K – 5K" },
            { value: "5K-15K", label: "5K – 15K" },
            { value: "15K-50K", label: "15K – 50K" },
          ],
          3: [
            { value: "100-500", label: "Under 500" },
            { value: "500-2K", label: "500 – 2K" },
            { value: "2K-5K", label: "2K – 5K" },
            { value: "5K-15K", label: "5K – 15K" },
            { value: "15K-50K", label: "15K – 50K" },
            { value: "50K-150K", label: "50K – 150K" },
          ],
          4: [
            { value: "500-2K", label: "Under 2K" },
            { value: "2K-5K", label: "2K – 5K" },
            { value: "5K-15K", label: "5K – 15K" },
            { value: "15K-50K", label: "15K – 50K" },
            { value: "50K-150K", label: "50K – 150K" },
            { value: "150K-300K", label: "150K – 300K" },
          ],
          5: [
            { value: "2K-5K", label: "Under 5K" },
            { value: "5K-15K", label: "5K – 15K" },
            { value: "15K-50K", label: "15K – 50K" },
            { value: "50K-150K", label: "50K – 150K" },
            { value: "150K-300K", label: "150K – 300K" },
            { value: "300K+", label: "300K+" },
          ],
        },
      },
      {
        id: "fanCommunicationFreq",
        label: "How often do you communicate digitally with fans?",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "Never", label: "Never" },
          { value: "Monthly", label: "Monthly" },
          { value: "Bi-weekly", label: "Bi-weekly" },
          { value: "Weekly", label: "Weekly" },
          { value: "Multiple per week", label: "Multiple per week" },
        ],
      },
      {
        id: "communityEventCount",
        label: "How many community events do you organize per year?",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "0-2", label: "0 – 2" },
          { value: "3-5", label: "3 – 5" },
          { value: "6-12", label: "6 – 12" },
          { value: "12-24", label: "12 – 24" },
          { value: "24+", label: "24+" },
        ],
      },
      // === T2+ additions ===
      {
        id: "seasonTicketRenewal",
        label: "Season ticket renewal rate",
        type: "radio-cards",
        minTier: 2,
        questionDescription: "Percentage of season ticket holders who renew for the following season. Tier-adjusted — elite clubs are expected to achieve 92%+ renewal rates.",
        tierOptions: {
          2: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-65%", label: "50 – 65%" },
            { value: "65-80%", label: "65 – 80%" },
            { value: "80-88%", label: "80%+" },
          ],
          3: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-65%", label: "50 – 65%" },
            { value: "65-80%", label: "65 – 80%" },
            { value: "80-88%", label: "80 – 88%" },
            { value: "88-92%", label: "88%+" },
          ],
          4: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-65%", label: "50 – 65%" },
            { value: "65-80%", label: "65 – 80%" },
            { value: "80-88%", label: "80 – 88%" },
            { value: "88-92%", label: "88 – 92%" },
            { value: "92%+", label: "92%+" },
          ],
          5: [
            { value: "<30%", label: "Under 30%" },
            { value: "30-50%", label: "30 – 50%" },
            { value: "50-65%", label: "50 – 65%" },
            { value: "65-80%", label: "65 – 80%" },
            { value: "80-88%", label: "80 – 88%" },
            { value: "88-92%", label: "88 – 92%" },
            { value: "92%+", label: "92%+" },
          ],
        },
      },
      {
        id: "matchdayExperience",
        label: "How would you rate your matchday experience quality?",
        type: "radio-cards",
        questionDescription: "Assesses the overall quality and distinctiveness of the in-venue experience, including atmosphere, facilities, catering, entertainment, and post-match engagement. Rate relative to your peer clubs at a similar level.",
        minTier: 2,
        options: [
          { value: "Poor", label: "Poor", tooltip: "Below basic standards; no fan programming. E.g. structurally deficient sections, no catering, no atmosphere management." },
          { value: "Below average", label: "Below average", tooltip: "Minimum functions; no differentiation. E.g. standard seating, single food kiosk, no programming." },
          { value: "Average", label: "Average", tooltip: "Meets tier expectations; some seasonal events. E.g. functional facilities, annual fan day, basic half-time show." },
          { value: "Good", label: "Good", tooltip: "Consistent programming; premium options available; feedback collected. E.g. fan zone, family section, post-match player walkabout." },
          { value: "Excellent", label: "Excellent", tooltip: "Best-in-class, externally benchmarked, award standards. E.g. multi-zone hospitality, gamified matchday app, live social wall." },
        ],
      },
      {
        id: "socialMediaActivePlatforms",
        label: "How many social media platforms are you actively managing?",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4-5", label: "4 – 5" },
          { value: "6+", label: "6+" },
        ],
      },
      // === T3+ additions ===
      {
        id: "netPromoterScore",
        label: "What is your Net Promoter Score (NPS) range?",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Don't measure", label: "Don't measure" },
          { value: "<20", label: "Under 20" },
          { value: "20-40", label: "20 – 40" },
          { value: "40-60", label: "40 – 60" },
          { value: "60+", label: "60+" },
        ],
      },
      {
        id: "fanDatabaseCoveragePercent",
        label: "What % of your total fanbase is in your first-party database?",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "<10%", label: "Under 10%" },
          { value: "10-25%", label: "10 – 25%" },
          { value: "25-50%", label: "25 – 50%" },
          { value: "50-75%", label: "50 – 75%" },
          { value: "75%+", label: "75%+" },
        ],
      },
      {
        id: "averageRevenuePerFan",
        label: "Average revenue per fan",
        type: "radio-cards",
        minTier: 3,
        questionDescription: "Total annual revenue divided by total unique fans who attended at least one home event during the season. Tier-adjusted — elite clubs are expected to generate $250+ per fan.",
        tierOptions: {
          3: [
            { value: "<$5", label: "Under $5" },
            { value: "$5-15", label: "$5 – $15" },
            { value: "$15-40", label: "$15 – $40" },
            { value: "$40-100", label: "$40 – $100" },
            { value: "$100-250", label: "$100 – $250" },
          ],
          4: [
            { value: "<$5", label: "Under $5" },
            { value: "$5-15", label: "$5 – $15" },
            { value: "$15-40", label: "$15 – $40" },
            { value: "$40-100", label: "$40 – $100" },
            { value: "$100-250", label: "$100 – $250" },
            { value: "$250-500", label: "$250 – $500" },
            { value: "$500+", label: "$500+" },
          ],
          5: [
            { value: "<$5", label: "Under $5" },
            { value: "$5-15", label: "$5 – $15" },
            { value: "$15-40", label: "$15 – $40" },
            { value: "$40-100", label: "$40 – $100" },
            { value: "$100-250", label: "$100 – $250" },
            { value: "$250-500", label: "$250 – $500" },
            { value: "$500+", label: "$500+" },
          ],
        },
      },
      {
        id: "fanSegmentation",
        label: "Do you use fan segmentation for marketing?",
        type: "radio-cards",
        questionDescription: "Measures how well your club understands different fan types and whether that knowledge tailors communications and commercial offers. Advanced segmentation directly increases revenue per fan.",
        minTier: 3,
        options: [
          { value: "No", label: "No", tooltip: "All fans receive identical communications. E.g. one newsletter to entire contact list." },
          { value: "Basic demographics", label: "Basic demographics", tooltip: "Segmented by age, gender, or geography. E.g. separate emails for U18 and adults." },
          { value: "Behavioral", label: "Behavioral segmentation", tooltip: "Based on actual engagement or purchase behavior. E.g. separate journeys for season ticket holders, casual attendees, and digital-only fans." },
          { value: "Advanced predictive", label: "Advanced predictive", tooltip: "AI/ML predicts future behavior and triggers personalized outreach. E.g. churn model identifies at-risk renewers 60 days before deadline." },
        ],
      },
      // === T4+ additions ===
      {
        id: "fanLifetimeValue",
        label: "Do you track fan lifetime value?",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No" },
          { value: "Basic estimate", label: "Basic estimate" },
          { value: "Calculated per segment", label: "Calculated per segment" },
          { value: "Fully modeled", label: "Fully modeled and optimized" },
        ],
      },
      {
        id: "loyaltyProgram",
        label: "Do you have a formal loyalty or rewards program?",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No" },
          { value: "Basic points", label: "Basic (points)" },
          { value: "Tiered program", label: "Tiered program" },
          { value: "Fully integrated", label: "Fully integrated ecosystem" },
        ],
      },
      {
        id: "fanDataInfrastructure",
        label: "Fan data infrastructure maturity",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No centralized data", label: "No centralized data" },
          { value: "Basic CRM", label: "Basic CRM" },
          { value: "CDP/DMP", label: "CDP / DMP" },
          { value: "Unified real-time", label: "Unified real-time data platform" },
        ],
      },
      {
        id: "globalFanResearch",
        label: "Global fan research programme",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "Never", label: "Never" },
          { value: "Ad-hoc", label: "Ad-hoc" },
          { value: "Annual", label: "Annual" },
          { value: "Bi-annual segmented", label: "Bi-annual segmented" },
          { value: "Continuous panel", label: "Continuous panel" },
        ],
      },
    ],
  },

  // ─── STEP 2: COMMERCIAL ATTRACTION (25%) ─────────────────────────────
  {
    id: "commercial",
    title: "Commercial Attraction",
    subtitle: "Sponsorship, revenue, and market positioning",
    icon: "TrendingUp",
    questions: [
      // === Core (T1+) ===
      {
        id: "sponsorCount",
        label: "Number of active sponsors and partners",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        questionDescription: "Total active commercial partnerships including title sponsors, kit sponsors, and category partners. Tier-adjusted — T5 clubs are expected to have 50+ partners.",
        tierOptions: {
          1: [
            { value: "0-2", label: "0 – 2" },
            { value: "3-5", label: "3 – 5" },
            { value: "6-10", label: "6 – 10" },
            { value: "11-20", label: "11 – 20" },
            { value: "21-35", label: "21+" },
          ],
          2: [
            { value: "0-2", label: "0 – 2" },
            { value: "3-5", label: "3 – 5" },
            { value: "6-10", label: "6 – 10" },
            { value: "11-20", label: "11 – 20" },
            { value: "21-35", label: "21+" },
          ],
          3: [
            { value: "0-2", label: "0 – 2" },
            { value: "3-5", label: "3 – 5" },
            { value: "6-10", label: "6 – 10" },
            { value: "11-20", label: "11 – 20" },
            { value: "21-35", label: "21 – 35" },
            { value: "36-50", label: "36+" },
          ],
          4: [
            { value: "0-2", label: "0 – 5" },
            { value: "6-10", label: "6 – 10" },
            { value: "11-20", label: "11 – 20" },
            { value: "21-35", label: "21 – 35" },
            { value: "36-50", label: "36 – 50" },
            { value: "51-70", label: "51+" },
          ],
          5: [
            { value: "0-2", label: "0 – 10" },
            { value: "11-20", label: "11 – 20" },
            { value: "21-35", label: "21 – 35" },
            { value: "36-50", label: "36 – 50" },
            { value: "51-70", label: "51 – 70" },
            { value: "70+", label: "70+" },
          ],
        },
      },
      {
        id: "sponsorRevenueShare",
        label: "Sponsorship revenue as % of total revenue",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "<10%", label: "Under 10%" },
          { value: "10-20%", label: "10 – 20%" },
          { value: "20-35%", label: "20 – 35%" },
          { value: "35-50%", label: "35 – 50%" },
          { value: "50%+", label: "50%+" },
        ],
      },
      {
        id: "digitalMonetization",
        label: "Do you actively monetize digital or data assets?",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No", label: "No" },
          { value: "Basic social ads", label: "Basic social ads" },
          { value: "Some digital packages", label: "Some digital packages" },
          { value: "Comprehensive digital inventory", label: "Comprehensive digital inventory" },
        ],
      },
      // === T1+ additions ===
      {
        id: "averageSponsorDealLength",
        label: "Average sponsor deal length",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "<1yr", label: "Under 1 year" },
          { value: "1yr", label: "1 year" },
          { value: "2yrs", label: "2 years" },
          { value: "3yrs", label: "3 years" },
          { value: "3+yrs", label: "3+ years" },
        ],
      },
      {
        id: "merchandiseRevenue",
        label: "Is merchandise a meaningful revenue stream?",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No merch", label: "No merch" },
          { value: "Minimal", label: "Minimal" },
          { value: "Growing", label: "Growing" },
          { value: "Significant", label: "Significant" },
          { value: "Core revenue stream", label: "Core revenue stream" },
        ],
      },
      // === T2+ additions ===
      {
        id: "hospitalityRevenue",
        label: "VIP / hospitality offering maturity",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "None", label: "None" },
          { value: "Basic matchday", label: "Basic matchday" },
          { value: "Some premium packages", label: "Some premium packages" },
          { value: "Full hospitality program", label: "Full hospitality program" },
          { value: "Best-in-class premium", label: "Best-in-class premium" },
        ],
      },
      {
        id: "sponsorActivation",
        label: "How active are sponsors in activating their partnerships?",
        type: "radio-cards",
        questionDescription: "Measures how actively your club brings sponsor brands to life beyond logo placement. High-quality activation increases sponsor retention and deal value.",
        minTier: 2,
        options: [
          { value: "Passive logos only", label: "Passive logos only", tooltip: "Name on kit/boards only. E.g. logo on shirt, pitchside board." },
          { value: "Some matchday activation", label: "Some matchday activation", tooltip: "Matchday-only activation. E.g. sponsor-named countdown clock, half-time prize draw." },
          { value: "Regular activations", label: "Regular activations", tooltip: "Consistent seasonal activation across owned channels. E.g. monthly sponsor social posts, branded content series." },
          { value: "Full multi-channel", label: "Full multi-channel", tooltip: "Sponsor present across digital, matchday, community, broadcast. E.g. email campaigns, app notifications, fan event co-branding." },
          { value: "Strategic co-creation", label: "Strategic co-creation", tooltip: "Club and sponsor jointly design products or experiences. E.g. joint product launch, co-branded documentary, fan loyalty tier named after sponsor." },
        ],
      },
      // === T3+ additions ===
      {
        id: "commercialRevenuePerSeat",
        label: "Commercial revenue per seat",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "<$100", label: "Under $100" },
          { value: "$100-300", label: "$100 – $300" },
          { value: "$300-800", label: "$300 – $800" },
          { value: "$800-2000", label: "$800 – $2,000" },
          { value: "$2000+", label: "$2,000+" },
        ],
      },
      {
        id: "sponsorSatisfaction",
        label: "Sponsor satisfaction / retention rate",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Low", label: "Low (under 50%)" },
          { value: "Moderate", label: "Moderate (50 – 70%)" },
          { value: "Good", label: "Good (70 – 85%)" },
          { value: "Very Good", label: "Very Good (85 – 95%)" },
          { value: "Excellent", label: "Excellent (95%+)" },
        ],
      },
      {
        id: "unfilledSponsorCategories",
        label: "Estimated unfilled sponsor categories",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "0-1", label: "0 – 1" },
          { value: "2-3", label: "2 – 3" },
          { value: "4-6", label: "4 – 6" },
          { value: "7-10", label: "7 – 10" },
          { value: "10+", label: "10+" },
        ],
      },
      {
        id: "digitalInventoryValue",
        label: "Digital inventory as % of commercial revenue",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "<5%", label: "Under 5%" },
          { value: "5-10%", label: "5 – 10%" },
          { value: "10-20%", label: "10 – 20%" },
          { value: "20-35%", label: "20 – 35%" },
          { value: "35%+", label: "35%+" },
        ],
      },
      {
        id: "revenueConcentration",
        label: "Revenue concentration risk",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Top sponsor >50%", label: "Top sponsor >50%" },
          { value: "Top sponsor 30-50%", label: "Top sponsor 30 – 50%" },
          { value: "Top 3 = 50-70%", label: "Top 3 = 50 – 70%" },
          { value: "Well diversified", label: "Well diversified" },
          { value: "Highly diversified", label: "Highly diversified" },
        ],
      },
      // === T4+ additions ===
      {
        id: "brandValuation",
        label: "Has the club been brand-valued?",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No" },
          { value: "Estimated internally", label: "Estimated internally" },
          { value: "Third-party valuation", label: "Third-party valuation" },
          { value: "Regular valuation", label: "Regular valuation with brand strategy" },
        ],
      },
      {
        id: "commercialInnovation",
        label: "Commercial innovation (fan tokens, NFTs, data products, etc.)",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None" },
          { value: "Exploring", label: "Exploring" },
          { value: "Some products live", label: "Some products live" },
          { value: "Revenue-generating portfolio", label: "Revenue-generating portfolio" },
        ],
      },
      {
        id: "internationalCommercialRevenue",
        label: "International commercial revenue share",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "<5%", label: "Under 5%" },
          { value: "5-15%", label: "5 – 15%" },
          { value: "15-30%", label: "15 – 30%" },
          { value: "30%+", label: "30%+" },
        ],
      },
      {
        id: "multiClubOwnership",
        label: "Multi-club ownership / affiliate network",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "No", label: "No" },
          { value: "Exploring", label: "Exploring" },
          { value: "Affiliated network", label: "Affiliated network" },
          { value: "Fully integrated MCO", label: "Fully integrated MCO" },
        ],
      },
      {
        id: "esgReportingMaturity",
        label: "ESG reporting maturity",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None" },
          { value: "Internal only", label: "Internal only" },
          { value: "Annual report", label: "Annual report" },
          { value: "Fully integrated", label: "Fully integrated" },
        ],
      },
      {
        id: "digitalProductRevenue",
        label: "Digital product revenue streams",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None" },
          { value: "1 product", label: "1 product" },
          { value: "2-3 products", label: "2 – 3 products" },
          { value: "Full digital ecosystem", label: "Full digital ecosystem" },
        ],
      },
      {
        id: "playerIpCommerc",
        label: "Player IP commercialisation",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None" },
          { value: "Ad-hoc", label: "Ad-hoc" },
          { value: "Structured program", label: "Structured programme" },
          { value: "Core revenue stream", label: "Core revenue stream" },
        ],
      },
    ],
  },

  // ─── STEP 3: TALENT ATTRACTION (15%) ─────────────────────────────────
  {
    id: "talent",
    title: "Talent Attraction",
    subtitle: "Player recruitment and development capabilities",
    icon: "Users",
    questions: [
      // === Core (T1+) ===
      {
        id: "playerAttraction",
        label: "How would you rate your ability to attract the players you target?",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Very difficult", label: "Very difficult" },
          { value: "Somewhat difficult", label: "Somewhat difficult" },
          { value: "Moderate", label: "Moderate" },
          { value: "Good", label: "Good" },
          { value: "Excellent", label: "Excellent" },
        ],
      },
      {
        id: "academyPathway",
        label: "Do you have a structured academy or development pathway?",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "No", label: "No" },
          { value: "Informal", label: "Informal" },
          { value: "Structured but underfunded", label: "Structured but underfunded" },
          { value: "Well-funded", label: "Well-funded" },
          { value: "Elite-level", label: "Elite-level" },
        ],
      },
      // === T1+ additions ===
      {
        id: "coachingCertifications",
        label: "Coaching staff certification level",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "None formal", label: "None formal" },
          { value: "Some certified", label: "Some certified" },
          { value: "Mostly certified", label: "Mostly certified" },
          { value: "All certified + CPD", label: "All certified + CPD" },
          { value: "High-profile coaching team", label: "High-profile coaching team" },
        ],
      },
      {
        id: "playerRetentionRate",
        label: "How well do you retain key players season-to-season?",
        type: "radio-cards",
        questionDescription: "Reflects the percentage of identified key players (starters, squad leaders) who remain at the club season-to-season. High retention signals strong culture and competitive proposition.",
        minTier: 1,
        options: [
          { value: "Very low", label: "Very low" },
          { value: "Low", label: "Low" },
          { value: "Moderate", label: "Moderate" },
          { value: "Good", label: "Good" },
          { value: "Excellent", label: "Excellent" },
        ],
      },
      {
        id: "volunteerCoachRatio",
        label: "Ratio of qualified to volunteer coaches",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "All volunteer", label: "All volunteer" },
          { value: "Mostly volunteer", label: "Mostly volunteer" },
          { value: "Mixed", label: "Mixed" },
          { value: "Mostly qualified", label: "Mostly qualified" },
          { value: "Fully professional", label: "Fully professional" },
        ],
      },
      // === T2+ additions ===
      {
        id: "scoutingNetwork",
        label: "Scouting network reach",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "None", label: "None" },
          { value: "Local only", label: "Local only" },
          { value: "Regional", label: "Regional" },
          { value: "National", label: "National" },
          { value: "International", label: "International" },
        ],
      },
      {
        id: "staffDevelopmentBudget",
        label: "Investment in staff development",
        type: "radio-cards",
        questionDescription: "Captures financial commitment to growing coaching and non-playing staff capabilities through courses, certifications, and external learning. Staff development correlates with retention and performance quality.",
        minTier: 2,
        options: [
          { value: "None", label: "None" },
          { value: "Minimal", label: "Minimal" },
          { value: "Moderate", label: "Moderate" },
          { value: "Significant", label: "Significant" },
          { value: "Industry-leading", label: "Industry-leading" },
        ],
      },
      // === T3+ additions ===
      {
        id: "academyToFirstTeam",
        label: "Academy-to-first-team conversion rate",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No academy", label: "No academy" },
          { value: "<5%", label: "Under 5%" },
          { value: "5-10%", label: "5 – 10%" },
          { value: "10-20%", label: "10 – 20%" },
          { value: "20%+", label: "20%+" },
        ],
      },
      {
        id: "performanceTechUsage",
        label: "Performance analytics technology",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "None", label: "None" },
          { value: "Basic GPS/video", label: "Basic GPS / video" },
          { value: "Some analytics", label: "Some analytics" },
          { value: "Full suite", label: "Full suite" },
          { value: "AI/ML-integrated", label: "AI / ML integrated" },
        ],
      },
      {
        id: "internationalScoutingReach",
        label: "International scouting coverage",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "None", label: "None" },
          { value: "1-2 countries", label: "1 – 2 countries" },
          { value: "Regional", label: "Regional" },
          { value: "Continental", label: "Continental" },
          { value: "Global", label: "Global" },
        ],
      },
      {
        id: "wageToRevenueRatio",
        label: "Wage-to-revenue ratio",
        type: "radio-cards",
        questionDescription: "Measures total wage expenditure as a percentage of total revenue. A lower ratio indicates greater sustainability and investment capacity. This question uses an inverted scale — lower percentage = higher score. Note: the financially \"healthy\" range differs by tier (see below).",
        minTier: 3,
        options: [
          { value: "<40%", label: "Under 40%" },
          { value: "40-55%", label: "40 – 55%" },
          { value: "55-65%", label: "55 – 65%" },
          { value: "65-75%", label: "65 – 75%" },
          { value: ">75%", label: "Over 75%" },
        ],
      },
      // === T4+ additions ===
      {
        id: "talentDataInfrastructure",
        label: "Recruitment data / AI infrastructure",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "Basic spreadsheets", label: "Basic spreadsheets" },
          { value: "Database", label: "Database" },
          { value: "Scouting platform", label: "Scouting platform" },
          { value: "Advanced analytics", label: "Advanced analytics" },
          { value: "Predictive models", label: "Predictive models" },
        ],
      },
      {
        id: "playerDevelopmentTracking",
        label: "Individual player development tracking",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None" },
          { value: "Basic notes", label: "Basic notes" },
          { value: "KPI-based", label: "KPI-based" },
          { value: "Full development profiles", label: "Full development profiles" },
          { value: "AI-assisted plans", label: "AI-assisted individual plans" },
        ],
      },
      {
        id: "talentBrandGlobal",
        label: "Global talent brand perception",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "Unknown", label: "Unknown" },
          { value: "Known regionally", label: "Known regionally" },
          { value: "National top employer", label: "National top employer" },
          { value: "Global destination", label: "Global destination" },
        ],
      },
    ],
  },

  // ─── STEP 4: MEDIA & CULTURAL ATTRACTION (15%) ───────────────────────
  {
    id: "media",
    title: "Media & Cultural Attraction",
    subtitle: "Content, visibility, and cultural impact",
    icon: "Megaphone",
    questions: [
      // === Core (T1+) ===
      {
        id: "contentOutput",
        label: "Monthly content output across all channels",
        type: "radio-cards",
        questionDescription: "Measures the volume and professionalism of original content across all channels. Volume drives algorithmic reach, media coverage, and fan engagement frequency.",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Minimal/ad-hoc", label: "Minimal / ad-hoc" },
          { value: "1-5 pieces/week", label: "1 – 5 pieces per week" },
          { value: "Daily content", label: "Daily content" },
          { value: "Multiple daily", label: "Multiple daily" },
          { value: "Professional content operation", label: "Professional content operation" },
        ],
      },
      {
        id: "mediaCoverage",
        label: "Local or regional media coverage frequency",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Rarely mentioned", label: "Rarely mentioned" },
          { value: "Occasional", label: "Occasional" },
          { value: "Regular coverage", label: "Regular coverage" },
          { value: "Featured weekly", label: "Featured weekly" },
          { value: "Constant coverage", label: "Constant coverage" },
        ],
      },
      // === T1+ additions ===
      {
        id: "dedicatedContentPerson",
        label: "Dedicated content person or team?",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "No one", label: "No one" },
          { value: "Part-time volunteer", label: "Part-time volunteer" },
          { value: "One dedicated person", label: "One dedicated person" },
          { value: "Small team", label: "Small team (2 – 3)" },
          { value: "Full content department", label: "Full content department" },
        ],
      },
      {
        id: "localMediaPartnerships",
        label: "Local media partnerships",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "None", label: "None" },
          { value: "1", label: "1" },
          { value: "2-3", label: "2 – 3" },
          { value: "4-5", label: "4 – 5" },
          { value: "5+", label: "5+" },
        ],
      },
      {
        id: "communityStorytellingEvents",
        label: "Community presence events per year",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "0", label: "0" },
          { value: "1-3", label: "1 – 3" },
          { value: "4-8", label: "4 – 8" },
          { value: "9-15", label: "9 – 15" },
          { value: "15+", label: "15+" },
        ],
      },
      // === T2+ additions ===
      {
        id: "websiteTraffic",
        label: "Monthly website unique visitors",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "<1K", label: "Under 1K" },
          { value: "1K-5K", label: "1K – 5K" },
          { value: "5K-25K", label: "5K – 25K" },
          { value: "25K-100K", label: "25K – 100K" },
          { value: "100K+", label: "100K+" },
        ],
      },
      {
        id: "contentPlatforms",
        label: "Platforms with original content",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "1", label: "1" },
          { value: "2-3", label: "2 – 3" },
          { value: "4-5", label: "4 – 5" },
          { value: "6-7", label: "6 – 7" },
          { value: "8+", label: "8+" },
        ],
      },
      // === T3+ additions ===
      {
        id: "contentProductionCadence",
        label: "Professional content production cadence",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No plan", label: "No plan" },
          { value: "Monthly plan", label: "Monthly plan" },
          { value: "Weekly plan", label: "Weekly plan" },
          { value: "Daily editorial calendar", label: "Daily editorial calendar" },
          { value: "Real-time content operation", label: "Real-time content operation" },
        ],
      },
      {
        id: "brandArchitecture",
        label: "Formal brand architecture / guidelines?",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No", label: "No" },
          { value: "Basic logo guide", label: "Basic logo guide" },
          { value: "Brand book", label: "Brand book" },
          { value: "Full architecture + governance", label: "Full architecture + governance" },
          { value: "Living brand system", label: "Living brand system" },
        ],
      },
      {
        id: "estimatedMediaValue",
        label: "Estimated annual media value",
        type: "radio-cards",
        minTier: 3,
        questionDescription: "Total estimated value of all media exposure including broadcast, digital, social, and earned media. Tier-adjusted — elite clubs generate hundreds of millions in media value.",
        tierOptions: {
          3: [
            { value: "Don't know", label: "Don't know" },
            { value: "<$500K", label: "Under $500K" },
            { value: "$500K-$2M", label: "$500K – $2M" },
            { value: "$2M-$10M", label: "$2M – $10M" },
            { value: "$10M-$50M", label: "$10M – $50M" },
          ],
          4: [
            { value: "Don't know", label: "Don't know" },
            { value: "<$500K", label: "Under $500K" },
            { value: "$500K-$2M", label: "$500K – $2M" },
            { value: "$2M-$10M", label: "$2M – $10M" },
            { value: "$10M-$50M", label: "$10M – $50M" },
            { value: "$50M-$200M", label: "$50M – $200M" },
          ],
          5: [
            { value: "Don't know", label: "Don't know" },
            { value: "<$500K", label: "Under $500K" },
            { value: "$500K-$2M", label: "$500K – $2M" },
            { value: "$2M-$10M", label: "$2M – $10M" },
            { value: "$10M-$50M", label: "$10M – $50M" },
            { value: "$50M-$200M", label: "$50M – $200M" },
            { value: "$200M+", label: "$200M+" },
          ],
        },
      },
      {
        id: "broadcastingReach",
        label: "Broadcasting / streaming reach",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No broadcasting", label: "No broadcasting" },
          { value: "Local only", label: "Local only" },
          { value: "Regional", label: "Regional" },
          { value: "National", label: "National" },
          { value: "International", label: "International" },
        ],
      },
      // === T4+ additions ===
      {
        id: "documentaryPresence",
        label: "Documentary / behind-the-scenes content",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None" },
          { value: "One-off features", label: "One-off features" },
          { value: "Regular series", label: "Regular series" },
          { value: "Premium production", label: "Premium production" },
          { value: "Original programming", label: "Original programming" },
        ],
      },
      {
        id: "culturalTranscendence",
        label: "Does the club transcend sport into broader culture?",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No" },
          { value: "Some local cultural role", label: "Some local cultural role" },
          { value: "Regional cultural icon", label: "Regional cultural icon" },
          { value: "National cultural relevance", label: "National cultural relevance" },
          { value: "International cultural brand", label: "International cultural brand" },
        ],
      },
      {
        id: "earnedMediaValue",
        label: "Do you track earned media value?",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No" },
          { value: "Ad-hoc estimates", label: "Ad-hoc estimates" },
          { value: "Regular tracking", label: "Regular tracking" },
          { value: "Full attribution model", label: "Full attribution model" },
        ],
      },
      {
        id: "globalMediaRightsStrat",
        label: "Global media rights strategy",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "No strategy", label: "No strategy" },
          { value: "Ad-hoc deals", label: "Ad-hoc deals" },
          { value: "Regional packages", label: "Regional packages" },
          { value: "Global portfolio", label: "Global portfolio" },
        ],
      },
    ],
  },

  // ─── STEP 5: COMPETITIVE ATTRACTION (15%) ────────────────────────────
  {
    id: "competitive",
    title: "Competitive Attraction",
    subtitle: "On-field performance and analytics maturity",
    icon: "Trophy",
    questions: [
      // === Core (T1+) ===
      {
        id: "leaguePositionTrend",
        label: "League position trend over the last 3 seasons",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Declining", label: "Declining" },
          { value: "Stable bottom half", label: "Stable bottom half" },
          { value: "Stable top half", label: "Stable top half" },
          { value: "Improving", label: "Improving" },
          { value: "Consistently top", label: "Consistently top" },
        ],
      },
      {
        id: "performanceAnalytics",
        label: "Do you use performance analytics or sport science?",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No", label: "No" },
          { value: "Basic stats", label: "Basic stats" },
          { value: "Some analytics", label: "Some analytics" },
          { value: "Dedicated department", label: "Dedicated department" },
          { value: "Advanced integrated system", label: "Advanced integrated system" },
        ],
      },
      // === T1+ additions ===
      {
        id: "competitiveGoalAlignment",
        label: "Competitive goals vs. actual results alignment",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Far below", label: "Far below" },
          { value: "Below", label: "Below" },
          { value: "Meeting", label: "Meeting" },
          { value: "Exceeding", label: "Exceeding" },
          { value: "Far exceeding", label: "Far exceeding" },
        ],
      },
      {
        id: "trophiesRecentYears",
        label: "Trophies, titles, or promotions in last 5 years",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "0", label: "0" },
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4+", label: "4+" },
        ],
      },
      // === T2+ additions ===
      {
        id: "continentalCompetition",
        label: "Continental / cup competition participation",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "Never", label: "Never" },
          { value: "Occasionally", label: "Occasionally (1 in 5 yrs)" },
          { value: "Regular", label: "Regular (2 – 3 in 5 yrs)" },
          { value: "Most years", label: "Most years" },
          { value: "Every year", label: "Every year" },
        ],
      },
      {
        id: "performanceDepartmentSize",
        label: "Performance / sports science staff",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "0", label: "0" },
          { value: "1", label: "1" },
          { value: "2-3", label: "2 – 3" },
          { value: "4-6", label: "4 – 6" },
          { value: "7+", label: "7+" },
        ],
      },
      // === T3+ additions ===
      {
        id: "peerBenchmarking",
        label: "How often do you benchmark against peers?",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Never", label: "Never" },
          { value: "Annually", label: "Annually" },
          { value: "Semi-annually", label: "Semi-annually" },
          { value: "Quarterly", label: "Quarterly" },
          { value: "Continuously", label: "Continuously" },
        ],
      },
      {
        id: "dataDecisionMaking",
        label: "Data-driven decision maturity",
        type: "radio-cards",
        questionDescription: "Assesses how systematically data informs strategic and operational decisions. Data maturity is a leading indicator of competitive and commercial efficiency.",
        minTier: 3,
        options: [
          { value: "Gut feel", label: "Gut feel" },
          { value: "Some data", label: "Some data" },
          { value: "Data-informed", label: "Data-informed" },
          { value: "Data-driven", label: "Data-driven" },
          { value: "AI-assisted", label: "AI-assisted" },
        ],
      },
      {
        id: "budgetPerformanceEfficiency",
        label: "Points per $M of squad spend vs. peers",
        type: "radio-cards",
        questionDescription: "Measures competitive points per million dollars of total budget, benchmarked relative to your peer clubs in the same tier and league. Not an absolute number — a T1 club in a regional league and a T5 club in Champions League are each assessed within their own context.",
        minTier: 3,
        options: [
          { value: "Well below", label: "Well below" },
          { value: "Below", label: "Below" },
          { value: "Average", label: "Average" },
          { value: "Above", label: "Above" },
          { value: "Well above", label: "Well above" },
        ],
      },
      // === T4+ additions ===
      {
        id: "globalCompetitivePosition",
        label: "Position in global competitive hierarchy for your sport",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "Bottom 50%", label: "Bottom 50%" },
          { value: "Lower-middle", label: "Lower-middle" },
          { value: "Upper-middle", label: "Upper-middle" },
          { value: "Top 25%", label: "Top 25%" },
          { value: "Top 10%", label: "Top 10%" },
        ],
      },
      {
        id: "performanceInnovation",
        label: "Performance innovation investment",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None" },
          { value: "Ad-hoc projects", label: "Ad-hoc projects" },
          { value: "Budget allocated", label: "Budget allocated" },
          { value: "Innovation team", label: "Innovation team" },
          { value: "Industry-leading R&D", label: "Industry-leading R&D" },
        ],
      },
      {
        id: "innovationDepartment",
        label: "Dedicated innovation department",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None" },
          { value: "Informal", label: "Informal" },
          { value: "Allocated budget", label: "Allocated budget" },
          { value: "Dedicated team", label: "Dedicated team" },
          { value: "Industry-leading R&D", label: "Industry-leading R&D" },
        ],
      },
    ],
  },
];

export const DIMENSION_META: Record<string, { label: string; icon: string; weight: string; color: string }> = {
  fan: { label: "Fan Attraction", icon: "Heart", weight: "30%", color: "hsl(177, 98%, 22%)" },
  commercial: { label: "Commercial Attraction", icon: "TrendingUp", weight: "25%", color: "hsl(38, 92%, 50%)" },
  talent: { label: "Talent Attraction", icon: "Users", weight: "15%", color: "hsl(262, 60%, 48%)" },
  media: { label: "Media & Cultural", icon: "Megaphone", weight: "15%", color: "hsl(142, 70%, 35%)" },
  competitive: { label: "Competitive Attraction", icon: "Trophy", weight: "15%", color: "hsl(0, 70%, 50%)" },
};
