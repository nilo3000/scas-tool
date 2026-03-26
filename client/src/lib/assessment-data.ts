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

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "DR Congo", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
  "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

export const REVENUE_RANGES = [
  { value: "Under $3M", label: "Under $3M", tier: 1, tierLabel: "Grassroots" },
  { value: "$3M-$10M", label: "$3M – $10M", tier: 2, tierLabel: "Foundation" },
  { value: "$10M-$50M", label: "$10M – $50M", tier: 3, tierLabel: "Challenger" },
  { value: "$50M-$300M", label: "$50M – $300M", tier: 4, tierLabel: "Contender" },
  { value: "Over $300M", label: "Over $300M", tier: 5, tierLabel: "Elite" },
];

export const TIER_PRICING: Record<number, { price: number; tierLabel: string; revenueRange: string; questions: string }> = {
  1: { price: 49, tierLabel: "Grassroots", revenueRange: "Under €3M", questions: "~32" },
  2: { price: 190, tierLabel: "Foundation", revenueRange: "€3M – €10M", questions: "~42" },
  3: { price: 390, tierLabel: "Challenger", revenueRange: "€10M – €50M", questions: "~62" },
  4: { price: 790, tierLabel: "Contender", revenueRange: "€50M – €300M", questions: "~75" },
  5: { price: 1490, tierLabel: "Elite", revenueRange: "Over €300M", questions: "~83" },
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
        questionDescription: "Your club's official name is used to personalise your SCAS report. In the free assessment, this field is optional — you can complete the assessment anonymously.",
        type: "text",
        placeholder: "e.g., FC Rheinstrom (optional in free tier)",
        /** Club name is optional in free tier — see assessment.tsx canProceed logic */
      },
      {
        id: "sport",
        label: "Primary Sport",
        questionDescription: "The primary sport your club competes in determines which benchmarks, norms, and peer comparisons are applied to your scores. A basketball club and a cricket club operate in structurally different commercial and talent landscapes, so sport-specific calibration makes your SCAS results meaningful.",
        type: "select",
        options: SPORTS.map(s => ({ value: s, label: s })),
      },
      {
        id: "country",
        label: "Country",
        questionDescription: "Your country of operation sets the economic, regulatory, and competitive context for your assessment. Revenue benchmarks, media market size, and talent pool depth all vary significantly between markets — a top club in Denmark operates in a very different environment from one in Brazil or South Korea.",
        type: "select",
        options: COUNTRIES.map(c => ({ value: c, label: c })),
      },
      {
        id: "annualRevenue",
        label: "Annual Revenue Range",
        questionDescription: "Select the range that best reflects your club's total income in the most recent completed season. This determines your assessment tier and ensures every score is calibrated to clubs at your level.",
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
        questionDescription: "Your primary catchment area is the local or regional population your club can realistically draw fans, members, and volunteers from. This figure helps adjust expectations for attendance, membership, and grassroots reach — a club in a city of 50,000 competing against one in a metro of 3 million is evaluated on a level playing field.",
        type: "radio-cards",
        options: [
          { value: "<10K", label: "Under 10,000", description: "Village / rural area", tooltip: "Rural or very small-town setting. E.g. a village cricket club or a small-town ice hockey club with a tight but loyal local community." },
          { value: "10K-50K", label: "10K – 50K", description: "Small town", tooltip: "Small town or district-level catchment. E.g. a handball club in a regional municipality or a rugby club serving a market town." },
          { value: "50K-150K", label: "50K – 150K", description: "Mid-size town", tooltip: "Mid-sized town. E.g. a basketball club competing in a regional league in a mid-tier provincial city." },
          { value: "150K-500K", label: "150K – 500K", description: "City", tooltip: "Large town or small city. E.g. a football club in a second-tier city with multiple competing sporting options." },
          { value: "500K-1M", label: "500K – 1M", description: "Large city", tooltip: "Major city or metropolitan area. E.g. a professional club in a regional capital with significant competition for leisure spend." },
          { value: "1M+", label: "Over 1M", description: "Major metro", tooltip: "Large metropolitan or national capital catchment. E.g. a top-flight club in a major city where multiple professional clubs compete for the same audience." },
        ],
      },
      // ─── v2.5: Virtual Catchment Area questions ─────────────────────────
      // digitalReachRatio REMOVED — now auto-computed from socialFollowers + catchmentPopulation
      // using log-scale normalization in the scoring engine (fairer across market sizes)
      {
        id: "marketCompetition",
        label: "How many other professional or semi-professional clubs in your sport compete for the same local audience?",
        questionDescription: "A club sharing its city with 5 other professional teams has a very different addressable fan base than the sole club in town. This question captures competitive density — how many other clubs at a similar or higher level are competing for the same supporters, sponsors, and media attention in your area.",
        type: "radio-cards",
        options: [
          { value: "sole_club", label: "Only club", description: "We are the only club of our level in the area", tooltip: "Your club has a local monopoly at your competitive level. The entire catchment population is your addressable audience without direct local competition for attention and spend." },
          { value: "1_2_clubs", label: "1–2 others", description: "1–2 other clubs at similar level", tooltip: "Moderate local competition. You share the market with a small number of peers — there is some audience fragmentation but you can still capture a large share of local sports interest." },
          { value: "3_5_clubs", label: "3–5 others", description: "3–5 other clubs at similar or higher level", tooltip: "A crowded local market. Your effective catchment is a fraction of the total population because multiple clubs compete for the same fans, sponsors, and media coverage." },
          { value: "6_plus_clubs", label: "6+ others", description: "Major metropolitan multi-club market", tooltip: "A hypercompetitive market like London, Istanbul, or Buenos Aires, where many clubs at similar or higher levels compete intensely for the same audience. Your addressable share of the local population is significantly diluted." },
        ],
      },
      {
        id: "sportMarketFit",
        label: "How popular is your sport in your country/region?",
        questionDescription: "A football club in Brazil and a lacrosse club in Brazil operate in the same city but face fundamentally different addressable audiences. This question captures sport-market fit — how much of the general population is a realistic potential audience for your sport, independent of your club's own performance.",
        type: "radio-cards",
        options: [
          { value: "dominant", label: "Dominant sport", description: "E.g. football in England, cricket in India", tooltip: "Your sport is the #1 sport in your country by participation, viewership, and cultural importance. The vast majority of the population is a realistic potential audience." },
          { value: "major", label: "Major sport", description: "Top 3 in the country but not dominant", tooltip: "Your sport is one of the top 3 sports in your country with strong mainstream interest and media coverage, but it is not the single dominant sport." },
          { value: "moderate", label: "Moderate sport", description: "Established but not mainstream", tooltip: "Your sport has an established presence and organized competitions but is not considered mainstream. It may have regional pockets of strength. E.g. handball in France, volleyball in Italy." },
          { value: "niche", label: "Niche sport", description: "Limited mainstream awareness", tooltip: "Your sport has limited mainstream awareness in your country. The potential audience is a specialist or enthusiast segment rather than the general population. E.g. cricket in Germany, lacrosse in Spain." },
        ],
      },
      // ─── end v2.4 Virtual Catchment questions ──────────────────────────
      {
        id: "internationalReach",
        label: "Does your club have a significant national or international following?",
        questionDescription: "Clubs at higher tiers often have fanbases that extend well beyond their home country, creating additional commercial, media, and talent opportunities. This question determines whether your SCAS assessment should include the international dimensions of fan engagement, commercial rights, and global talent branding — sections that are less relevant for clubs with a purely local following.",
        type: "radio-cards",
        showWhen: (answers) => {
          const rev = answers.annualRevenue;
          return rev === "$10M-$50M" || rev === "$50M-$300M" || rev === "Over $300M";
        },
        options: [
          { value: "local", label: "Mostly local/regional", description: "Fans are primarily from the immediate area", tooltip: "Your club's fanbase and commercial activity is predominantly local or regional. E.g. a T3 rugby club with strong local support but no meaningful international following." },
          { value: "national", label: "National presence", description: "Significant following across the country", tooltip: "Your club has a measurable national following beyond your immediate catchment area but limited international presence." },
          { value: "international", label: "International brand", description: "Meaningful international fanbase or diaspora following", tooltip: "Your club has a measurable following, commercial partnerships, or media audience outside your home country. E.g. a basketball club with replica shirt sales across three continents or a cricket club with a global diaspora audience." },
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
        id: "venueCapacity",
        label: "What is your venue's total capacity?",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        questionDescription: "Your venue's total seating or standing capacity sets the structural scale of your matchday operation. Combined with your attendance percentage, this tells us both how well you fill your venue and how large your matchday footprint actually is — which directly affects commercial potential, atmosphere, and media appeal.",
        options: [
          { value: "<500", label: "Under 500", description: "Small ground", tooltip: "A small facility typical of grassroots clubs. E.g. a local pitch with basic standing areas or a small indoor arena." },
          { value: "500-2K", label: "500 – 2,000", description: "Community venue", tooltip: "A community-scale venue with some permanent seating. E.g. a local football ground or indoor sports hall with a seated stand." },
          { value: "2K-5K", label: "2,000 – 5,000", description: "Mid-size ground", tooltip: "A mid-size venue capable of hosting competitive fixtures with a meaningful matchday atmosphere. E.g. a regional league stadium or large sports hall." },
          { value: "5K-15K", label: "5,000 – 15,000", description: "Professional venue", tooltip: "A professional-grade venue with full infrastructure for matchday hospitality, media, and commercial activation. E.g. a second-division football stadium or a large basketball arena." },
          { value: "15K-40K", label: "15,000 – 40,000", description: "Major stadium", tooltip: "A major stadium with significant commercial infrastructure. E.g. a top-flight football stadium or a large multi-sport arena." },
          { value: "40K+", label: "40,000+", description: "Elite venue", tooltip: "A world-class venue with maximum commercial, broadcast, and hospitality capability. E.g. a national stadium, a Champions League-grade arena." },
        ],
      },
      {
        id: "attendanceCapacity",
        label: "Average matchday attendance as % of venue capacity",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        questionDescription: "Percentage of available seats filled on a typical matchday. This measures operational efficiency — how well you convert your venue's capacity into actual attendance. Combined with your venue size, it gives a complete picture of your matchday strength.",
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
        questionDescription: "Knowing who your fans are is the foundation of every commercial and engagement strategy. This question measures whether your club has a reliable, usable record of fan contact details and preferences — without which personalisation, direct marketing, and fan retention programmes are impossible.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No", label: "No", tooltip: "No systematic record of fan contact details exists. E.g. you rely entirely on social media audiences you don't own and have no direct way to contact fans between matchdays." },
          { value: "Basic spreadsheet", label: "Basic spreadsheet", tooltip: "Fan contacts stored in a shared spreadsheet or email list. E.g. a handball club collecting emails at sign-up events but with no tagging, history, or automation capability." },
          { value: "Dedicated CRM", label: "Dedicated CRM", tooltip: "A purpose-built customer relationship management system tracks fan contacts, preferences, and interactions. E.g. a rugby club using a sports CRM to log ticketing history and communication opt-ins." },
          { value: "Advanced with segmentation", label: "Advanced CRM with segmentation", tooltip: "The CRM contains rich data and fans are grouped into meaningful segments for targeted communications. E.g. a basketball club that separates season ticket holders, single-game buyers, youth members, and lapsed fans into distinct journeys." },
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
        questionDescription: "Regular, consistent communication keeps your club front-of-mind and drives matchday attendance, merchandise sales, and membership renewals. This question captures how frequently your club actively reaches out to its known fanbase through owned digital channels such as email or app notifications.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "Never", label: "Never", tooltip: "No regular digital outreach. E.g. the club only posts publicly on social media and has no direct channel to fans." },
          { value: "Monthly", label: "Monthly", tooltip: "One communication per month. E.g. a monthly newsletter summarising results, upcoming fixtures, and club news — sufficient for a small grassroots club." },
          { value: "Bi-weekly", label: "Bi-weekly", tooltip: "Two communications per month. E.g. a pre-matchday preview email and a post-matchday results summary for a semi-professional cricket club." },
          { value: "Weekly", label: "Weekly", tooltip: "At least one direct communication every week. E.g. a mid-table football club sending weekly fixture previews, merchandise promotions, and behind-the-scenes content." },
          { value: "Multiple per week", label: "Multiple per week", tooltip: "Three or more direct communications weekly. E.g. an elite basketball club combining daily push notifications, email campaigns, and SMS match alerts." },
        ],
      },
      {
        id: "communityEventCount",
        label: "How many community & media presence events do you organize per year?",
        questionDescription: "Community presence events — school visits, open training sessions, charity fundraisers, local festivals, player appearances, charity matchdays — build organic fan loyalty AND generate media coverage. This question scores in both Fan Attraction and Media & Cultural Attraction, reflecting the dual impact of community engagement.",
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
        label: "How many platforms are you actively producing original content on?",
        questionDescription: "Being present on multiple platforms with original content increases the total audience a club can reach, builds media credibility, and creates commercial inventory for sponsors. 'Active' means posting original content at least twice per week. This question scores in both Fan Attraction and Media & Cultural Attraction.",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "1", label: "1", tooltip: "Single-platform presence. E.g. a grassroots ice hockey club posting only on Facebook to keep the existing parent community informed." },
          { value: "2", label: "2", tooltip: "Two active platforms. E.g. a cricket club managing Instagram for match photos and Facebook for event announcements." },
          { value: "3", label: "3", tooltip: "Three active platforms. E.g. a handball club running Instagram, Facebook, and YouTube with regular matchday clips." },
          { value: "4-5", label: "4 – 5", tooltip: "Four or five platforms. E.g. a semi-professional rugby club active on Instagram, X (Twitter), Facebook, YouTube, and TikTok, with content tailored for each." },
          { value: "6+", label: "6+", tooltip: "Six or more platforms, including emerging channels. E.g. an elite football club maintaining Instagram, X, Facebook, YouTube, TikTok, Snapchat, and a WeChat presence for international audiences." },
        ],
      },
      // === T3+ additions ===
      {
        id: "netPromoterScore",
        label: "What is your Net Promoter Score (NPS) range?",
        questionDescription: "Net Promoter Score (NPS) is a standard measure of fan loyalty and word-of-mouth potential, calculated by asking fans how likely they are to recommend the club. A high NPS indicates a fanbase that actively recruits new fans, which is the most cost-effective form of fan acquisition available to any club.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Don't measure", label: "Don't measure", tooltip: "The club has never formally surveyed fans on likelihood to recommend. Without a baseline NPS, it is impossible to track whether fan loyalty is improving or deteriorating over time." },
          { value: "<20", label: "Under 20", tooltip: "Low loyalty; significant detractors in the fanbase. E.g. a club that has experienced poor on-field results and a stadium or service quality that consistently disappoints fans." },
          { value: "20-40", label: "20 – 40", tooltip: "Moderate loyalty; more promoters than detractors but room for improvement. E.g. a mid-table basketball club with solid but unremarkable fan experience." },
          { value: "40-60", label: "40 – 60", tooltip: "Strong loyalty; fans are actively positive about the club. E.g. a rugby club with a vibrant community programme and consistently good matchday hospitality." },
          { value: "60+", label: "60+", tooltip: "Exceptional loyalty comparable to the best sports and consumer brands. E.g. clubs like Barcelona or the All Blacks whose fans describe membership as a core part of their identity." },
        ],
      },
      {
        id: "fanDatabaseCoveragePercent",
        label: "What % of your total fanbase is in your first-party database?",
        questionDescription: "Having fan contact data only matters if it covers a meaningful share of your actual fanbase. This question measures the gap between the fans you know (first-party database) and the total number of people who follow or attend your club — a large gap signals missed commercial and engagement opportunity.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "<10%", label: "Under 10%", tooltip: "The vast majority of fans are unknown to the club. E.g. a club selling tickets through a third-party platform that does not share buyer data, with no email sign-up at the gate." },
          { value: "10-25%", label: "10 – 25%", tooltip: "A small fraction of the fanbase is captured. E.g. a cricket club with 3,000 email subscribers and an estimated attendance of 20,000 across the season." },
          { value: "25-50%", label: "25 – 50%", tooltip: "Around a quarter to half of fans are known. E.g. a handball club that has run one data capture campaign and integrated online ticketing with its CRM." },
          { value: "50-75%", label: "50 – 75%", tooltip: "Most fans are in the database. E.g. a basketball club that requires registration for ticket purchase and runs an active membership scheme." },
          { value: "75%+", label: "75%+", tooltip: "Near-complete fan data coverage. E.g. an elite rugby club where season tickets, app downloads, and loyalty programme sign-ups together capture almost every active supporter." },
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
        questionDescription: "Fan lifetime value (LTV) estimates the total revenue a club can expect from a single fan across their entire relationship — covering tickets, merchandise, hospitality, and memberships over years or decades. Clubs that understand LTV invest marketing resources more wisely and retain fans with far greater commercial impact.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No", tooltip: "The club does not calculate or estimate what an individual fan is worth over time. Decisions about fan acquisition and retention are made without a financial framework." },
          { value: "Basic estimate", label: "Basic estimate", tooltip: "A rough, club-wide average LTV figure is used. E.g. 'our average season ticket holder stays for 7 years at $400/year, so we value them at roughly $2,800.'" },
          { value: "Calculated per segment", label: "Calculated per segment", tooltip: "LTV is calculated separately for different fan groups. E.g. a football club models LTV differently for youth members, family season ticket holders, and corporate hospitality clients." },
          { value: "Fully modeled", label: "Fully modeled and optimized", tooltip: "LTV is embedded into marketing spend decisions, with campaigns triggered at key moments in the fan lifecycle. E.g. an elite basketball club automatically upgrades high-LTV fans from standard membership to premium tiers when behavioural data signals readiness." },
        ],
      },
      {
        id: "loyaltyProgram",
        label: "Do you have a formal loyalty or rewards program?",
        questionDescription: "A formal loyalty or rewards programme gives fans a tangible reason to increase their engagement with the club beyond matchday attendance. Well-designed programmes increase visit frequency, merchandise spend, and long-term retention by making fans feel recognised and rewarded for their commitment.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No", tooltip: "No loyalty or rewards scheme exists. Fans receive no formal recognition for repeated attendance or spending." },
          { value: "Basic points", label: "Basic (points)", tooltip: "A simple points-for-purchase scheme. E.g. a cricket club where fans earn points for buying tickets, redeemable for discounts on merchandise." },
          { value: "Tiered program", label: "Tiered program", tooltip: "Multiple membership tiers with escalating benefits based on spending or engagement. E.g. a basketball club with Bronze, Silver, and Gold tiers offering progressively better seat upgrades, early access, and exclusive events." },
          { value: "Fully integrated", label: "Fully integrated ecosystem", tooltip: "Loyalty is embedded across every fan touchpoint — tickets, hospitality, digital, merchandise — with personalised rewards and partner benefits. E.g. an elite football club whose loyalty app integrates stadium access, retail purchases, streaming, and partner discounts into a single points wallet." },
        ],
      },
      {
        id: "fanDataInfrastructure",
        label: "Fan data infrastructure maturity",
        questionDescription: "The quality of your fan data infrastructure determines how effectively you can personalise communications, optimise commercial offers, and predict fan behaviour. This question assesses the technical maturity of the systems underpinning your fan relationship — from basic contact lists through to real-time unified data platforms.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No centralized data", label: "No centralized data", tooltip: "Fan information is scattered across disconnected systems or does not exist digitally. E.g. paper sign-up sheets, unmerged email lists, and a separate ticketing database with no integration." },
          { value: "Basic CRM", label: "Basic CRM", tooltip: "A single CRM system holds fan contact data but with limited enrichment or integration. E.g. a rugby club using a basic sports CRM to manage member renewals and occasional email campaigns." },
          { value: "CDP/DMP", label: "CDP / DMP", tooltip: "A Customer Data Platform (CDP) or Data Management Platform (DMP) consolidates data from multiple sources into unified fan profiles. E.g. a handball club merging ticketing, merchandise, and social engagement data to build a single view of each fan." },
          { value: "Unified real-time", label: "Unified real-time data platform", tooltip: "A fully integrated, real-time platform connects all fan touchpoints and enables instant personalisation. E.g. an elite basketball club where a fan opening the mobile app mid-game receives instant offers based on their seat location, purchase history, and current in-venue behaviour." },
        ],
      },
      {
        id: "globalFanResearch",
        label: "Global fan research programme",
        questionDescription: "For T5 clubs, global fans often represent the majority of commercial upside. This measures how systematically the club researches its international fanbase.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "Never", label: "Never", tooltip: "The club has no structured programme for understanding its international audience. E.g. no surveys, no international social listening, no market research in overseas territories." },
          { value: "Ad-hoc", label: "Ad-hoc", tooltip: "Occasional one-off research into global fans, typically triggered by a specific commercial need. E.g. a survey sent to overseas kit buyers once, or a one-time social analytics report on international followers." },
          { value: "Annual", label: "Annual", tooltip: "Annual research into the global fanbase providing a baseline view of international fan size, demographics, and preferences. E.g. a yearly international fan survey conducted ahead of pre-season commercial planning." },
          { value: "Bi-annual segmented", label: "Bi-annual segmented", tooltip: "Twice-yearly research that segments international fans by territory, demographics, and behaviour. E.g. a club that conducts in-depth market research in its top five international markets each spring and autumn, using findings to inform territory-specific commercial and content strategies." },
          { value: "Continuous panel", label: "Continuous panel", tooltip: "An always-on international fan research panel providing real-time insight into global audience behaviour, attitudes, and commercial preferences. E.g. an elite football club running a permanent global fan panel across 20+ countries, with monthly reporting feeding into commercial, content, and strategic decisions." },
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
        questionDescription: "Sponsorship revenue as a proportion of total income indicates how commercially developed a club's partnership programme is and how dependent the club is on a single revenue source. A healthy commercial mix reduces financial risk and signals the club's attractiveness to the market.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "<10%", label: "Under 10%", tooltip: "Sponsorship contributes a minimal share of income. E.g. a grassroots ice hockey club where most revenue comes from player registrations and gate receipts, with only one or two small local business partners." },
          { value: "10-20%", label: "10 – 20%", tooltip: "Sponsorship is a secondary revenue stream. E.g. a semi-professional handball club with a kit sponsor and a handful of matchday board advertisers." },
          { value: "20-35%", label: "20 – 35%", tooltip: "Sponsorship is a meaningful pillar of club income. E.g. a regional basketball club with a title sponsor, kit deal, and five to eight category partners contributing roughly a quarter of revenue." },
          { value: "35-50%", label: "35 – 50%", tooltip: "Sponsorship is a primary revenue driver. E.g. a professional rugby club where sponsor income rivals matchday revenue as a core commercial pillar." },
          { value: "50%+", label: "50%+", tooltip: "The majority of revenue comes from commercial partnerships. E.g. a top-flight club whose media rights income is modest but whose global brand attracts major multi-year sponsorship commitments." },
        ],
      },
      {
        id: "digitalMonetization",
        label: "Do you actively monetize digital or data assets?",
        questionDescription: "Digital assets — social media audiences, email databases, app users, website traffic, and fan data — represent a growing commercial opportunity that many clubs leave largely untapped. This question measures how actively your club converts digital attention into revenue.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No", label: "No", tooltip: "Digital channels are used solely for communication; no revenue is generated from digital assets. E.g. a club with 20,000 Instagram followers that has never offered sponsored content or digital advertising." },
          { value: "Basic social ads", label: "Basic social ads", tooltip: "Occasional paid social media promotions for sponsors or the club's own commercial offers. E.g. a cricket club running a boosted Facebook post for a sponsor's product launch." },
          { value: "Some digital packages", label: "Some digital packages", tooltip: "Structured digital advertising packages are sold to commercial partners. E.g. a basketball club offering sponsors a bundle of social posts, email newsletter placements, and website banner ads." },
          { value: "Comprehensive digital inventory", label: "Comprehensive digital inventory", tooltip: "A full digital commercial offering spanning social, email, app, website, streaming, and data. E.g. an elite football club selling premium digital sponsorship packages that include native content, audience targeting, and post-campaign performance reporting." },
        ],
      },
      // === T1+ additions ===
      {
        id: "averageSponsorDealLength",
        label: "Average sponsor deal length",
        questionDescription: "The average length of sponsor contracts is a direct indicator of partner confidence in the club. Longer deals deliver financial stability, deeper activation relationships, and reduced commercial sales costs — a club with mostly multi-year partnerships is less exposed to revenue volatility than one reliant on annual renewals.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "<1yr", label: "Under 1 year", tooltip: "Most deals are short-term or one-off agreements. E.g. a single-event sponsor or a trial deal with a local business that has not yet committed beyond one season." },
          { value: "1yr", label: "1 year", tooltip: "Standard annual contracts with no multi-year commitment. E.g. a handball club renewing all sponsor agreements each summer with no forward visibility." },
          { value: "2yrs", label: "2 years", tooltip: "Two-year deals provide modest forward revenue certainty. E.g. a rugby club that has successfully moved its top three partners onto two-season agreements." },
          { value: "3yrs", label: "3 years", tooltip: "Three-year deals signal strong partner confidence and enable long-term activation planning. E.g. a basketball club with a three-year title sponsorship underpinning its commercial strategy." },
          { value: "3+yrs", label: "3+ years", tooltip: "Long-term strategic partnerships of four years or more. E.g. an elite football club with a five-year kit deal and a multi-year stadium naming rights agreement that provide revenue certainty for the entire planning cycle." },
        ],
      },
      {
        id: "merchandiseRevenue",
        label: "Is merchandise a meaningful revenue stream?",
        questionDescription: "Merchandise is one of the few revenue streams a club can grow independently of on-field results or broadcast deals. Strong merchandise performance reflects brand strength, fan loyalty, and commercial capability — and creates a revenue stream that pays year-round, not just on matchdays.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No merch", label: "No merch", tooltip: "The club sells no branded merchandise. E.g. a grassroots cricket club with no kit shop and no online store." },
          { value: "Minimal", label: "Minimal", tooltip: "Basic, low-volume merchandise exists but generates negligible income. E.g. a small basketball club selling a handful of branded scarves at the entry gate." },
          { value: "Growing", label: "Growing", tooltip: "Merchandise is an emerging revenue stream with deliberate investment. E.g. a semi-professional handball club that has launched an online shop and introduced a new home kit, generating modest but growing sales." },
          { value: "Significant", label: "Significant", tooltip: "Merchandise is a material revenue contributor. E.g. a professional rugby club with a well-designed kit range, club shop, and seasonal merchandise collections generating six-figure annual revenue." },
          { value: "Core revenue stream", label: "Core revenue stream", tooltip: "Merchandise rivals matchday income as a commercial pillar. E.g. an elite football or basketball club where jersey sales alone generate multi-million dollar annual revenue, driven by global e-commerce and licensed retail." },
        ],
      },
      // === T2+ additions ===
      {
        id: "hospitalityRevenue",
        label: "VIP / hospitality offering maturity",
        questionDescription: "Premium hospitality — VIP lounges, corporate boxes, fine dining packages — is typically the highest-margin revenue stream available to a club per head. This question assesses the maturity and scale of your club's hospitality offering relative to its tier and venue capacity.",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "None", label: "None", tooltip: "No hospitality or premium experience offering exists. E.g. all fans access the same standard facility with no premium options." },
          { value: "Basic matchday", label: "Basic matchday", tooltip: "Simple premium options available on matchday only. E.g. a reserved seating area with a pre-match meal, sold to a small number of corporate guests at a grassroots rugby club." },
          { value: "Some premium packages", label: "Some premium packages", tooltip: "A small range of hospitality packages is available but not systematically sold. E.g. a basketball club offering a VIP lounge with limited capacity and basic catering, sold through informal relationships." },
          { value: "Full hospitality program", label: "Full hospitality program", tooltip: "A structured hospitality suite with tiered packages, corporate sales, and consistent delivery. E.g. a professional handball club with two hospitality zones, matchday packages sold months in advance, and a dedicated account manager." },
          { value: "Best-in-class premium", label: "Best-in-class premium", tooltip: "Industry-leading hospitality comparable to the best venues in the sport. E.g. an elite club with multi-level premium experience zones, private boxes, Michelin-quality catering, and exclusive player access packages sold at four-figure per-head prices." },
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
        questionDescription: "Commercial revenue per seat measures how effectively a club extracts commercial value from its venue capacity — combining sponsorship, hospitality, naming rights, and digital activation. It is a key efficiency metric that normalises commercial performance across clubs of different sizes.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "<$100", label: "Under $100", tooltip: "Very early-stage commercial programme relative to venue size. E.g. a regional ice hockey club with a 3,000-seat arena generating less than $300K in total commercial revenue." },
          { value: "$100-300", label: "$100 – $300", tooltip: "Developing commercial programme with a basic partner portfolio. E.g. a semi-professional basketball club with a title sponsor and a handful of category partners." },
          { value: "$300-800", label: "$300 – $800", tooltip: "Solid commercial operation with structured sponsorship packages and hospitality income. E.g. a professional cricket club generating meaningful partner revenue across a 5,000-seat ground." },
          { value: "$800-2000", label: "$800 – $2,000", tooltip: "High-performing commercial model generating strong per-seat yield. E.g. a top-division rugby club with a well-developed hospitality programme and long-term corporate partnerships." },
          { value: "$2000+", label: "$2,000+", tooltip: "Elite commercial performance. E.g. a Champions League football club or NBA franchise where premium hospitality, naming rights, and global sponsorship drive exceptional per-seat commercial revenue." },
        ],
      },
      {
        id: "sponsorSatisfaction",
        label: "Sponsor satisfaction / retention rate",
        questionDescription: "Sponsor satisfaction is a leading indicator of renewal rates and deal value growth. Clubs that measure and actively manage partner satisfaction retain sponsors longer and command higher fees — dissatisfied sponsors leave at renewal, which is far more expensive than keeping them happy.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Low", label: "Low (under 50%)", tooltip: "Most sponsors are dissatisfied; high churn risk. E.g. a club that signed partners without delivering promised activation, resulting in non-renewals and reputational damage in the local business community." },
          { value: "Moderate", label: "Moderate (50 – 70%)", tooltip: "Mixed satisfaction; some partners see value but activation delivery is inconsistent. E.g. a cricket club where larger sponsors are well-served but smaller partners feel neglected." },
          { value: "Good", label: "Good (70 – 85%)", tooltip: "Most sponsors are satisfied and renewing. E.g. a basketball club with a structured end-of-season review process and consistent delivery against agreed activation plans." },
          { value: "Very Good", label: "Very Good (85 – 95%)", tooltip: "Strong satisfaction; sponsors are advocates for the club in their own networks. E.g. a rugby club where sponsors regularly refer new partners and proactively extend deals without prompting." },
          { value: "Excellent", label: "Excellent (95%+)", tooltip: "Near-universal satisfaction; the club is regarded as a best-in-class commercial partner. E.g. an elite club with a dedicated sponsor servicing team, real-time activation reporting, and annual partner summits that drive loyalty." },
        ],
      },
      {
        id: "unfilledSponsorCategories",
        label: "Estimated unfilled sponsor categories",
        questionDescription: "Every commercial category your club has not yet filled — from official car partner to official beer, from insurance to telecoms — represents untapped revenue potential. This question estimates how much commercial white space remains in your sponsorship portfolio.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "0-1", label: "0 – 1", tooltip: "The commercial portfolio is almost fully occupied across relevant categories. E.g. an elite football club with partners in every major category, leaving only niche or emerging sectors open." },
          { value: "2-3", label: "2 – 3", tooltip: "A small number of attractive categories remain available. E.g. a professional basketball club that has secured most key partners but has no official technology or travel partner yet." },
          { value: "4-6", label: "4 – 6", tooltip: "A moderate number of categories are unfilled, representing meaningful upside. E.g. a semi-professional rugby club with a kit and title sponsor but no category coverage in food, drink, or automotive." },
          { value: "7-10", label: "7 – 10", tooltip: "Significant commercial white space exists across the portfolio. E.g. a regional handball club with only two active sponsors and a dozen relevant local business categories not yet approached." },
          { value: "10+", label: "10+", tooltip: "The sponsorship programme is at an early stage with most categories open. E.g. a newly promoted club that has not yet built a structured commercial function and has sponsors in fewer than three categories." },
        ],
      },
      {
        id: "digitalInventoryValue",
        label: "Digital inventory as % of commercial revenue",
        questionDescription: "The share of commercial revenue derived from digital inventory — sponsored social content, email placements, app advertising, website banners, branded video — indicates how well the club is monetising its growing digital audiences. Digital inventory is increasingly the primary driver of sponsorship value growth.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "<5%", label: "Under 5%", tooltip: "Digital assets contribute almost nothing to commercial revenue. E.g. sponsor exposure is limited to pitchside boards, kit logos, and stadium signage." },
          { value: "5-10%", label: "5 – 10%", tooltip: "A minor but growing digital component in sponsor packages. E.g. a cricket club adding sponsored social posts and newsletter placements to its standard partnership offerings." },
          { value: "10-20%", label: "10 – 20%", tooltip: "Digital inventory is an established part of the commercial mix. E.g. a basketball club packaging sponsored video content, social reach guarantees, and email placements into a structured digital tier." },
          { value: "20-35%", label: "20 – 35%", tooltip: "Digital inventory represents a significant share of sponsor value. E.g. a professional football club where digital deliverables — including influencer content and branded matchday clips — account for roughly a quarter of sponsor value delivered." },
          { value: "35%+", label: "35%+", tooltip: "Digital-first commercial model; sponsors primarily buy digital reach and data. E.g. an elite club where global digital audiences dwarf matchday attendance, making social, streaming, and data assets the most valuable commercial inventory." },
        ],
      },
      {
        id: "revenueConcentration",
        label: "Revenue concentration risk",
        questionDescription: "Revenue concentration measures how reliant your club is on a single sponsor or revenue source. High concentration creates financial vulnerability — if one major partner exits, the entire commercial model is at risk. A diversified revenue base is a mark of commercial maturity and long-term sustainability.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Top sponsor >50%", label: "Top sponsor >50%", tooltip: "One partner accounts for more than half of total commercial revenue. E.g. a small cricket club where a single local construction company's naming rights deal makes up the majority of all sponsorship income — their exit would be devastating." },
          { value: "Top sponsor 30-50%", label: "Top sponsor 30 – 50%", tooltip: "Heavy reliance on one partner but with some diversification. E.g. a handball club with a significant title sponsor and a small number of secondary partners generating limited revenue." },
          { value: "Top 3 = 50-70%", label: "Top 3 = 50 – 70%", tooltip: "The top three partners represent just over half of commercial income — moderate concentration. E.g. a rugby club with a solid top tier of partners but limited depth below them." },
          { value: "Well diversified", label: "Well diversified", tooltip: "No single partner dominates and revenue is spread across many relationships. E.g. a professional basketball club with ten or more sponsors each contributing a meaningful but not dominant share of commercial revenue." },
          { value: "Highly diversified", label: "Highly diversified", tooltip: "Commercial income is spread across 20+ partners and multiple revenue streams with no single point of failure. E.g. an elite club with a deep partner portfolio spanning global brands, regional partners, and digital-first commercial products." },
        ],
      },
      // === T4+ additions ===
      {
        id: "brandValuation",
        label: "Has the club been brand-valued?",
        questionDescription: "A formal brand valuation quantifies the financial worth of your club's name, identity, and reputation as a commercial asset. Knowing your brand's value enables better sponsorship pricing, stronger negotiating positions, informed investment decisions, and a framework for tracking brand growth over time.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No", tooltip: "The club has never had its brand formally valued. Most grassroots and regional clubs fall here — without it, pricing sponsor packages is largely guesswork." },
          { value: "Estimated internally", label: "Estimated internally", tooltip: "The club has produced an informal internal estimate of brand value. E.g. a mid-level rugby club that has benchmarked its social following and media coverage against similar clubs to arrive at a rough brand value figure." },
          { value: "Third-party valuation", label: "Third-party valuation", tooltip: "A formal brand valuation has been conducted by an external specialist. E.g. a professional basketball club that commissioned a brand analytics firm to independently assess its commercial and media value ahead of a sponsorship negotiation." },
          { value: "Regular valuation", label: "Regular valuation with brand strategy", tooltip: "Brand value is measured annually and the findings directly inform commercial strategy, pricing, and marketing investment. E.g. an elite club that uses an annual brand report to set minimum partnership fees and track the impact of marketing campaigns on brand equity." },
        ],
      },
      {
        id: "commercialInnovation",
        label: "Commercial innovation (fan tokens, NFTs, data products, etc.)",
        questionDescription: "Commercial innovation — fan tokens, NFTs, data licensing, digital collectibles, paid content platforms, and other emerging products — signals a club's ambition to create new revenue streams beyond traditional sponsorship and ticketing. Early-stage investment in these areas positions clubs to capture significant upside as the sports economy evolves.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None", tooltip: "No commercial innovation activities or products. E.g. all revenue comes from conventional matchday, sponsorship, and merchandise channels." },
          { value: "Exploring", label: "Exploring", tooltip: "The club is researching or piloting innovative commercial concepts without a live product. E.g. a football club attending blockchain sports conferences and in early conversations with fan token platforms." },
          { value: "Some products live", label: "Some products live", tooltip: "At least one innovative commercial product is live and generating fan or partner engagement. E.g. a basketball club that has launched a fan token on a sports blockchain platform or a cricket club offering an exclusive paid digital archive subscription." },
          { value: "Revenue-generating portfolio", label: "Revenue-generating portfolio", tooltip: "Multiple innovative commercial products are generating meaningful revenue. E.g. an elite club with an active fan token programme, a licensed NFT collectibles range, and a premium OTT content subscription — together contributing materially to total commercial income." },
        ],
      },
      {
        id: "internationalCommercialRevenue",
        label: "International commercial revenue share",
        questionDescription: "The share of commercial revenue generated from outside the club's home country is a direct measure of global brand reach and commercial development. International revenue — from overseas sponsors, cross-border merchandise sales, foreign broadcast rights, and global licensing — represents the highest-growth commercial opportunity for ambitious clubs.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "<5%", label: "Under 5%", tooltip: "Essentially all commercial income is domestic. E.g. a professional handball club whose sponsors are all local businesses and whose merchandise is sold only in-stadium." },
          { value: "5-15%", label: "5 – 15%", tooltip: "A small but growing international commercial footprint. E.g. a rugby club with one international kit supplier deal and modest cross-border online merchandise sales." },
          { value: "15-30%", label: "15 – 30%", tooltip: "International commercial revenue is a meaningful contributor. E.g. a basketball club with regional sponsorship deals in multiple countries and an overseas broadcast agreement." },
          { value: "30%+", label: "30%+", tooltip: "International commercial revenue is a core pillar of the club's income. E.g. an elite football or cricket club where global broadcasting rights, international kit deals, and overseas licensing agreements rival domestic commercial income." },
        ],
      },
      {
        id: "multiClubOwnership",
        label: "Multi-club ownership / affiliate network",
        questionDescription: "Multi-club ownership (MCO) structures — where a parent organisation controls clubs in multiple countries or leagues — create powerful competitive advantages through shared scouting networks, player development pathways, and commercial synergies. This T5 question assesses whether your club benefits from or participates in such a structure.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "No", label: "No", tooltip: "The club operates entirely independently with no ownership links to other clubs. E.g. a standalone T5 football club with no subsidiary or affiliated clubs in other markets." },
          { value: "Exploring", label: "Exploring", tooltip: "The club is actively evaluating MCO structures or early-stage affiliate relationships. E.g. a professional basketball club in discussions with a North American franchise about a formal player pathway agreement." },
          { value: "Affiliated network", label: "Affiliated network", tooltip: "The club has formal affiliate or feeder relationships with clubs in one or more markets, sharing players or commercial resources. E.g. a T5 rugby club with a signed development partnership with two regional clubs feeding academy talent upward." },
          { value: "Fully integrated MCO", label: "Fully integrated MCO", tooltip: "The club is part of a fully operational multi-club ownership group with shared systems, strategy, and commercial infrastructure across multiple clubs. E.g. a City Football Group-style model where player data, scouting, commercial deals, and brand assets are managed centrally across five or more clubs globally." },
        ],
      },
      {
        id: "esgReportingMaturity",
        label: "ESG reporting maturity",
        questionDescription: "Environmental, Social, and Governance (ESG) reporting is increasingly required by major sponsors, investors, and governing bodies as evidence that a club operates responsibly and sustainably. This T5 question measures how formally your club tracks and communicates its ESG performance — which is fast becoming a prerequisite for elite commercial partnerships.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None", tooltip: "No formal ESG tracking or reporting. E.g. the club has no stated sustainability targets, diversity data, or community impact measurement." },
          { value: "Internal only", label: "Internal only", tooltip: "ESG data is tracked internally but not published or shared with external stakeholders. E.g. a club that monitors energy consumption and diversity statistics for management purposes but produces no external report." },
          { value: "Annual report", label: "Annual report", tooltip: "A formal ESG or sustainability report is published annually. E.g. a T5 football club that publishes an annual community and sustainability report aligned to recognised ESG frameworks." },
          { value: "Fully integrated", label: "Fully integrated", tooltip: "ESG performance is embedded into strategy, executive KPIs, and commercial negotiations, with real-time data tracking and public disclosure. E.g. an elite club whose sustainability credentials are a core selling point in sponsor negotiations, with carbon neutrality targets, DEI commitments, and community investment all formally reported and externally assured." },
        ],
      },
      {
        id: "digitalProductRevenue",
        label: "Digital product revenue streams",
        questionDescription: "Digital products — OTT streaming subscriptions, premium apps, paid content archives, fantasy or gaming products — represent a club's ability to monetise its audience through owned digital channels rather than relying entirely on third-party platforms. This T5 question measures how developed the club's direct-to-consumer digital revenue portfolio is.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None", tooltip: "No paid digital products exist. E.g. all digital content is free, available on public social channels with no subscription or premium tier." },
          { value: "1 product", label: "1 product", tooltip: "A single paid digital product is live. E.g. a premium match archive subscription or a club-branded mobile app with a paid tier." },
          { value: "2-3 products", label: "2 – 3 products", tooltip: "A small portfolio of digital revenue products. E.g. a T5 basketball club with an OTT live streaming subscription, a fantasy game, and a paid match highlights archive." },
          { value: "Full digital ecosystem", label: "Full digital ecosystem", tooltip: "A comprehensive suite of digital products generating significant revenue. E.g. an elite club with a proprietary streaming platform, a fan engagement app with paid premium features, a gaming partnership, and a licensed data product — all contributing materially to overall revenue." },
        ],
      },
      {
        id: "playerIpCommerc",
        label: "Player IP commercialisation",
        questionDescription: "Player intellectual property (IP) commercialisation — generating revenue from players' names, images, likenesses, and personal brands through licensing, partnerships, and appearances — is one of the highest-value and fastest-growing commercial opportunities for elite clubs. This T5 question assesses how systematically your club develops and monetises player IP.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None", tooltip: "Player IP is not commercially exploited by the club. E.g. no structured image rights programme, no player appearance fees, no licensed use of player likenesses in commercial products." },
          { value: "Ad-hoc", label: "Ad-hoc", tooltip: "Occasional one-off commercial uses of player images or appearances, typically without a formal programme. E.g. a T5 club that occasionally arranges player appearances for a major sponsor but has no systematic approach or contractual framework." },
          { value: "Structured program", label: "Structured programme", tooltip: "A formal player IP programme with contracted rights, defined commercial uses, and revenue sharing. E.g. a professional basketball club with image rights clauses in all player contracts and a structured commercial appearances programme managed by the commercial team." },
          { value: "Core revenue stream", label: "Core revenue stream", tooltip: "Player IP is a major commercial revenue source with dedicated resource and global licensing deals. E.g. an elite football club where top player image rights, global licensing partnerships, and branded digital content generate tens of millions of dollars annually." },
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
        questionDescription: "Your club's ability to attract the players it targets is a direct measure of sporting ambition, competitive positioning, and cultural appeal. Clubs that consistently land their first-choice signings have stronger commercial leverage, better results, and a more compelling story to tell fans, sponsors, and potential new players.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Very difficult", label: "Very difficult", tooltip: "The club rarely attracts its primary transfer targets; players consistently choose other options. E.g. a rugby club that loses out on most recruitment targets to rival clubs, often on wage or sporting project grounds." },
          { value: "Somewhat difficult", label: "Somewhat difficult", tooltip: "The club attracts some targets but misses many, often having to go to second or third choices. E.g. a basketball club that can sign regional talent reliably but struggles to compete for national-level players." },
          { value: "Moderate", label: "Moderate", tooltip: "The club signs a reasonable proportion of its primary targets but with significant competition. E.g. a handball club that is competitive for mid-tier professional players but rarely wins the recruitment battle for top targets." },
          { value: "Good", label: "Good", tooltip: "The club wins more recruitment battles than it loses and is regarded as a desirable destination. E.g. a semi-professional ice hockey club known for its development pathway that regularly attracts young talent away from rival clubs." },
          { value: "Excellent", label: "Excellent", tooltip: "The club is widely regarded as a leading destination and attracts its primary targets with high consistency. E.g. an elite football club where the ambition of the sporting project, training facilities, and club culture are powerful recruitment tools." },
        ],
      },
      {
        id: "academyPathway",
        label: "Do you have a structured academy or development pathway?",
        questionDescription: "A structured academy or development pathway is the most sustainable long-term talent strategy available to any club — it reduces transfer fees, builds club culture, and creates commercially valuable players. This question assesses the depth and quality of your club's youth development infrastructure.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "No", label: "No", tooltip: "The club has no youth or development programme. E.g. a senior-only cricket club with no junior section or pathway to the first team." },
          { value: "Informal", label: "Informal", tooltip: "Youth activity exists but without structured coaching, progression criteria, or a clear pathway to senior competition. E.g. a basketball club with under-18 teams run by volunteer parents with no certified coaches or formal curriculum." },
          { value: "Structured but underfunded", label: "Structured but underfunded", tooltip: "A formal academy exists with defined age groups and a coaching curriculum, but financial constraints limit its quality and reach. E.g. a handball club with a recognised development programme but unable to retain quality coaches or invest in specialist facilities." },
          { value: "Well-funded", label: "Well-funded", tooltip: "A well-resourced academy with professional coaches, quality facilities, and a defined pathway from youth to senior competition. E.g. a professional rugby club whose academy regularly produces players that earn senior squad contracts." },
          { value: "Elite-level", label: "Elite-level", tooltip: "A top-tier development programme benchmarked against national or international standards, with a proven track record of producing professional players. E.g. an elite football academy that has produced multiple international-level players and is formally licensed at the highest level." },
        ],
      },
      // === T1+ additions ===
      {
        id: "coachingCertifications",
        label: "Coaching staff certification level",
        questionDescription: "The certification level of your coaching staff is a reliable indicator of the quality and consistency of player development across the club. Formally qualified coaches deliver better structured training, demonstrate the club's commitment to professional standards, and are increasingly required by governing bodies for club licensing.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "None formal", label: "None formal", tooltip: "No coaching staff hold recognised coaching qualifications. E.g. a grassroots ice hockey club run entirely by enthusiastic but uncertified parent volunteers." },
          { value: "Some certified", label: "Some certified", tooltip: "A minority of coaches hold relevant qualifications. E.g. a cricket club where the first team coach is qualified but junior coaches are not formally certified." },
          { value: "Mostly certified", label: "Mostly certified", tooltip: "The majority of coaches hold at least entry-level governing body qualifications. E.g. a handball club where most age-group coaches hold a Level 2 national coaching certificate." },
          { value: "All certified + CPD", label: "All certified + CPD", tooltip: "All coaches are formally qualified and participate in ongoing continuing professional development. E.g. a basketball club where every coach from under-10s to the first team holds a current national federation licence and attends annual CPD workshops." },
          { value: "High-profile coaching team", label: "High-profile coaching team", tooltip: "Coaching staff include individuals of national or international repute, elevating the club's attractiveness to players. E.g. a professional rugby club whose head coach is a former international player with UEFA or World Rugby Pro Certificate credentials, making the club a destination for ambitious players seeking elite development." },
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
        label: "What best describes your coaching workforce?",
        questionDescription: "The composition of your coaching workforce — from all-volunteer to fully professional — reflects the overall standard of coaching delivery and the club's investment in player development. At grassroots level, being 100% volunteer-run is completely normal; the scoring is calibrated so that volunteer-led clubs are not penalised for their operational reality, but clubs investing in paid roles are recognized for building toward professional standards.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "All volunteers", label: "All volunteers (no paid coaching staff)", tooltip: "Every coaching role is filled by unpaid volunteers. This is the norm for grassroots clubs. E.g. a village football club where all age-group teams are coached by parents or former players in their own time, with no budget for paid coaching." },
          { value: "Mostly volunteers, 1-2 paid", label: "Mostly volunteers, 1–2 paid roles", tooltip: "The club has taken the first step toward professional coaching by employing one or two paid roles, with the rest covered by volunteers. E.g. a cricket club where the first-team head coach is employed part-time but all junior teams are volunteer-led." },
          { value: "Mix of paid and volunteer", label: "Mix of paid and volunteer", tooltip: "Roughly equal numbers of paid/qualified coaches and volunteers working together. E.g. a basketball club with three full-time coaches alongside five certified volunteer coaches running age-group teams." },
          { value: "Mostly paid, some volunteer", label: "Mostly paid staff, some volunteer support", tooltip: "The majority of coaching positions are filled by paid, professionally qualified coaches, with volunteers in supporting roles. E.g. a professional handball club with a full-time coaching staff and a handful of volunteer assistants in junior sections." },
          { value: "Fully professional staff", label: "Fully professional coaching staff", tooltip: "All coaching positions are professional paid roles with formal qualifications and contracts. E.g. an elite ice hockey club with a fully contracted coaching and support staff across all academy age groups and the first team." },
        ],
      },
      // === T2+ additions ===
      {
        id: "scoutingNetwork",
        label: "Scouting network reach",
        questionDescription: "The geographic reach of your scouting network determines the talent pool your club can identify and recruit from. Clubs that scout beyond their immediate locality gain a significant competitive advantage by accessing players that rivals have not yet identified or valued.",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "None", label: "None", tooltip: "No formal scouting activity. E.g. a grassroots basketball club that signs players only through word of mouth or direct enquiries." },
          { value: "Local only", label: "Local only", tooltip: "Scouting covers only the immediate local area or city. E.g. a cricket club that monitors local league results and occasionally watches matches within a 30-kilometre radius." },
          { value: "Regional", label: "Regional", tooltip: "Scouting covers multiple cities or a broader geographic region. E.g. a handball club with scouts attending matches across several provinces or states." },
          { value: "National", label: "National", tooltip: "The club has scouting coverage across the entire home country. E.g. a professional ice hockey club with a part-time scouting network monitoring all national league divisions." },
          { value: "International", label: "International", tooltip: "Scouting actively covers multiple countries. E.g. an elite football club with full-time scouts in six or more countries, supported by video scouting platforms covering international competitions." },
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
        questionDescription: "The percentage of academy players who progress to first-team competition is the ultimate measure of your development pathway's effectiveness. High conversion rates generate significant commercial value by reducing transfer fees, demonstrating coaching quality, and creating narratives that attract new talent and fans.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No academy", label: "No academy", tooltip: "The club has no youth development programme from which players could graduate to the first team." },
          { value: "<5%", label: "Under 5%", tooltip: "Very few academy players reach the first team. E.g. fewer than one in twenty graduates earns a professional contract or a regular senior squad place." },
          { value: "5-10%", label: "5 – 10%", tooltip: "A small but meaningful proportion of academy players progress. E.g. one or two players per academy cohort go on to represent the first team at some level." },
          { value: "10-20%", label: "10 – 20%", tooltip: "A solid conversion rate indicating an effective development pathway. E.g. a rugby club where approximately one in eight academy graduates earns a professional contract." },
          { value: "20%+", label: "20%+", tooltip: "Exceptional conversion rate, representing a world-class development programme. E.g. an elite basketball or football club whose academy regularly produces first-team players and generates significant transfer fee income." },
        ],
      },
      {
        id: "performanceTechUsage",
        label: "Performance analytics technology",
        questionDescription: "Performance analytics technology — GPS tracking, video analysis, heart rate monitoring, load management software — enables coaches to make evidence-based decisions about training, selection, and injury prevention. The sophistication of technology in use is a proxy for the overall professionalism of the club's sporting operation.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "None", label: "None", tooltip: "No technology is used to track or analyse player performance. E.g. training loads and playing decisions are based entirely on coaching observation and experience." },
          { value: "Basic GPS/video", label: "Basic GPS / video", tooltip: "Basic tracking tools are in use. E.g. a semi-professional rugby club using GPS vests to monitor player distance and speed, and recording training sessions for review." },
          { value: "Some analytics", label: "Some analytics", tooltip: "Performance data is collected and analysed to inform specific decisions. E.g. a basketball club using video analysis software to review opposition tactics and track shooting efficiency metrics." },
          { value: "Full suite", label: "Full suite", tooltip: "A comprehensive performance analytics system is in use across the squad. E.g. a professional handball club with integrated GPS, heart rate, load management, and video analysis platforms, all feeding into a central performance database." },
          { value: "AI/ML-integrated", label: "AI / ML integrated", tooltip: "AI and machine learning are embedded in performance analysis, training load management, and tactical planning. E.g. an elite club using predictive injury models, automated video tagging, and real-time tactical dashboards during matches." },
        ],
      },
      {
        id: "internationalScoutingReach",
        label: "International scouting coverage",
        questionDescription: "International scouting reach measures how broadly a club casts its recruitment net across global talent markets. Clubs with international scouting capability access a far larger and more diverse talent pool, enabling better value recruitment and earlier identification of emerging players before rivals.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "None", label: "None", tooltip: "No international recruitment activity. E.g. the club signs only locally based players with no monitoring of overseas markets." },
          { value: "1-2 countries", label: "1 – 2 countries", tooltip: "Scouting covers one or two additional markets, typically neighbouring countries or those with cultural or language ties. E.g. a Belgian basketball club that also monitors the Dutch and French leagues." },
          { value: "Regional", label: "Regional", tooltip: "Scouting covers a broader multi-country region. E.g. a Scandinavian ice hockey club that scouts across all five Nordic nations as a matter of routine." },
          { value: "Continental", label: "Continental", tooltip: "Scouting covers an entire continent. E.g. a professional rugby club with scouts covering all major European competition plus some video monitoring of Southern Hemisphere leagues." },
          { value: "Global", label: "Global", tooltip: "Scouting spans multiple continents with systematic coverage of all major talent markets. E.g. an elite football club with full-time scouts in Europe, South America, Africa, and Asia, supported by data analytics platforms that monitor thousands of players worldwide." },
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
        questionDescription: "The quality of a club's recruitment data infrastructure determines how efficiently it identifies, evaluates, and tracks potential signings. Clubs with advanced scouting platforms and data analytics tools make faster, better-informed recruitment decisions than those relying on manual processes and institutional memory.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "Basic spreadsheets", label: "Basic spreadsheets", tooltip: "Player information is stored in unstructured spreadsheets or personal notes. E.g. a scouting shortlist maintained in an Excel file that only one person can access or update." },
          { value: "Database", label: "Database", tooltip: "A structured database stores player profiles, scouting reports, and contact details. E.g. a basketball club using a shared digital database where scouts can log observations after each match." },
          { value: "Scouting platform", label: "Scouting platform", tooltip: "A dedicated scouting or recruitment platform is in use. E.g. a handball club using a sports-specific scouting platform to track players across multiple leagues, compile video clips, and share reports with the coaching staff." },
          { value: "Advanced analytics", label: "Advanced analytics", tooltip: "Performance data, video analysis, and contextual statistics are integrated into recruitment decisions. E.g. a professional football club combining its scouting platform with StatsBomb or equivalent data to quantify player value and rank targets by statistical fit." },
          { value: "Predictive models", label: "Predictive models", tooltip: "Machine learning and predictive analytics are used to identify talent before it is widely recognised. E.g. an elite football club using proprietary models to identify undervalued players in lower leagues based on performance data, physical attributes, and developmental trajectory." },
        ],
      },
      {
        id: "playerDevelopmentTracking",
        label: "Individual player development tracking",
        questionDescription: "Individual player development tracking measures how well a club monitors each player's progress against defined performance goals, identifying strengths, development areas, and injury risks. Systematic tracking improves player outcomes, reduces dropout, and creates a competitive advantage in talent retention.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None", tooltip: "No systematic individual development tracking. E.g. player progression is assessed informally by coaches at training with no written records or performance benchmarks." },
          { value: "Basic notes", label: "Basic notes", tooltip: "Informal written notes are maintained for key players. E.g. a cricket club's head coach keeping a notebook with observations about top young players, reviewed at end-of-season selection meetings." },
          { value: "KPI-based", label: "KPI-based", tooltip: "Players are assessed against defined key performance indicators, reviewed on a structured schedule. E.g. a basketball club tracking each academy player against speed, shooting accuracy, defensive metrics, and effort scores every six weeks." },
          { value: "Full development profiles", label: "Full development profiles", tooltip: "Comprehensive individual profiles combine physical, technical, tactical, and psychological data updated regularly. E.g. a professional rugby club where each player has a digital development plan reviewed monthly by coaches, medical staff, and the player themselves." },
          { value: "AI-assisted plans", label: "AI-assisted individual plans", tooltip: "Artificial intelligence analyses player data to personalise training programmes and predict development trajectories. E.g. an elite football club where an AI platform recommends individual weekly training loads, nutrition adjustments, and technical focus areas based on GPS, biometric, and performance data." },
        ],
      },
      {
        id: "talentBrandGlobal",
        label: "Global talent brand perception",
        questionDescription: "A club's global talent brand is its reputation among elite players worldwide as a destination worth choosing. Strong global talent brand reputation reduces recruitment costs, attracts better players, and creates a self-reinforcing cycle — elite players attract other elite players. This T5 question assesses how your club is perceived as an employer in the global talent market.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "Unknown", label: "Unknown", tooltip: "The club has no meaningful profile in global player markets. E.g. a T5 club in a smaller market that elite international players have not heard of." },
          { value: "Known regionally", label: "Known regionally", tooltip: "The club is recognised as a credible destination within its region but not beyond. E.g. a professional basketball club that is well-regarded within its continent but not considered by players from outside the region." },
          { value: "National top employer", label: "National top employer", tooltip: "The club is regarded as one of the leading employment destinations for players within its home country. E.g. a T5 cricket or ice hockey club that consistently attracts the country's best domestic talent but rarely signs international stars." },
          { value: "Global destination", label: "Global destination", tooltip: "The club is recognised globally as one of the most desirable destinations in its sport. E.g. an elite football, basketball, or cricket club whose project, facilities, and culture attract the world's top players regardless of financial competition." },
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
        questionDescription: "Regular media coverage amplifies your club's reach beyond its existing fanbase, builds commercial value for sponsors, and signals relevance to potential players, partners, and talent. This question measures how frequently your club appears in local or regional journalism, broadcasting, and online news — not coverage you pay for, but coverage earned through newsworthiness.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Rarely mentioned", label: "Rarely mentioned", tooltip: "The club receives almost no media coverage. E.g. match results occasionally appear in the local newspaper's community sport roundup but the club is rarely if ever proactively covered." },
          { value: "Occasional", label: "Occasional", tooltip: "The club receives sporadic media coverage, typically tied to notable results or events. E.g. a cricket club featured in local news after winning a regional cup but not covered on a regular basis." },
          { value: "Regular coverage", label: "Regular coverage", tooltip: "The club is covered consistently by local media throughout the competitive season. E.g. a basketball club that receives weekly match reports and occasional feature articles in the regional newspaper." },
          { value: "Featured weekly", label: "Featured weekly", tooltip: "The club is a regular, prominent fixture in local media — pre-match previews, post-match analysis, and features. E.g. a rugby club whose matches are broadcast on local radio and whose manager conducts weekly press briefings." },
          { value: "Constant coverage", label: "Constant coverage", tooltip: "The club generates daily media interest across multiple outlets and platforms. E.g. a top-flight football club that is covered across national broadcast, regional print, and digital outlets on a continuous basis throughout the year." },
        ],
      },
      // === T1+ additions ===
      {
        id: "dedicatedContentPerson",
        label: "Dedicated content person or team?",
        questionDescription: "The presence of a dedicated content creator or team is one of the strongest predictors of consistent, high-quality digital output. Without a named person responsible for content, clubs tend to produce irregular, low-quality material that underperforms algorithmically and fails to build audience. This question measures the resource commitment behind your content operation.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "No one", label: "No one", tooltip: "Content is produced ad hoc by whoever is available, with no dedicated responsibility. E.g. match photos are occasionally uploaded by a committee member when they remember." },
          { value: "Part-time volunteer", label: "Part-time volunteer", tooltip: "A volunteer gives up some of their time to manage club content but has no formal content training or allocated hours. E.g. a cricket club with a supporter who manages the Instagram account in their spare time." },
          { value: "One dedicated person", label: "One dedicated person", tooltip: "A single staff member or contracted professional is responsible for content full-time. E.g. a basketball club that employs a content manager to run all social media, produce match highlights, and manage the website." },
          { value: "Small team", label: "Small team (2 – 3)", tooltip: "A small team of two to three content professionals covers matchday, social, and editorial content. E.g. a professional handball club with a content manager, a video editor, and a social media coordinator." },
          { value: "Full content department", label: "Full content department", tooltip: "A full in-house content operation with specialists across video, social, photography, written, and broadcast. E.g. an elite football club with a media department of ten or more staff producing broadcast-quality daily content." },
        ],
      },
      {
        id: "localMediaPartnerships",
        label: "Local media partnerships",
        questionDescription: "Formal partnerships with local media outlets — newspapers, radio stations, television channels, digital publishers — increase a club's coverage quality and frequency beyond what editorial interest alone generates. They also create commercial inventory (branded segments, co-produced content) that can be sold to sponsors.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "None", label: "None", tooltip: "No formal agreements with local or regional media outlets. E.g. the club relies entirely on journalists choosing to cover it rather than any structured media relationship." },
          { value: "1", label: "1", tooltip: "One formal media partnership in place. E.g. a rugby club with an agreement for a local radio station to broadcast one match per month and conduct a weekly club phone-in." },
          { value: "2-3", label: "2 – 3", tooltip: "Two to three media partnerships creating regular coverage across different formats. E.g. a basketball club with partnerships with the local newspaper, a regional radio station, and a community TV channel." },
          { value: "4-5", label: "4 – 5", tooltip: "A strong media partnership portfolio delivering multi-channel coverage. E.g. a cricket club with agreements spanning print, radio, digital news, and a regional streaming platform." },
          { value: "5+", label: "5+", tooltip: "An extensive media partnership portfolio covering every major local and regional outlet. E.g. a professional football club with comprehensive media partnerships that provide daily coverage across print, broadcast, online, and social media platforms." },
        ],
      },
      // U1: communityStorytellingEvents REMOVED — merged with communityEventCount (Fan)
      // The single question now scores in both Fan and Media dimensions
      // === T2+ additions ===
      {
        id: "websiteTraffic",
        label: "Monthly website unique visitors",
        questionDescription: "Monthly unique website visitors measure the size of the club's owned digital audience — people actively seeking out club information rather than passively encountering it on social media. Website traffic is a core commercial metric: it underpins digital advertising value, drives merchandise sales, and reflects overall brand health.",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "<1K", label: "Under 1K", tooltip: "Very limited website audience. E.g. a grassroots cricket club whose website is visited mainly by current members looking for fixture lists." },
          { value: "1K-5K", label: "1K – 5K", tooltip: "Small but engaged website audience, typical for active community clubs. E.g. a local basketball club whose website receives traffic during match weeks." },
          { value: "5K-25K", label: "5K – 25K", tooltip: "A meaningful digital audience indicating regional profile. E.g. a semi-professional handball club with a regular monthly readership of local fans and scouting interest." },
          { value: "25K-100K", label: "25K – 100K", tooltip: "A substantial online audience indicating strong regional or emerging national profile. E.g. a professional rugby club with consistent web traffic from fans, media, and commercial partners." },
          { value: "100K+", label: "100K+", tooltip: "A large digital audience with national or international reach. E.g. an elite football or basketball club whose website serves a global fanbase, media professionals, and commercial partners." },
        ],
      },
      // U1: contentPlatforms REMOVED — merged with socialMediaActivePlatforms (Fan)
      // The single question now scores in both Fan and Media dimensions
      // === T3+ additions ===
      {
        id: "contentProductionCadence",
        label: "Professional content production cadence",
        questionDescription: "A structured content production cadence — from a monthly plan to a real-time editorial operation — determines whether a club's content strategy is reactive or proactive. Clubs with editorial discipline produce more consistent, higher-quality content, build algorithmic reach faster, and present a more credible media proposition to sponsors.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No plan", label: "No plan", tooltip: "Content is produced with no schedule or forward planning. E.g. a cricket club that posts match photos when someone remembers to upload them after the game." },
          { value: "Monthly plan", label: "Monthly plan", tooltip: "Content is planned a month in advance, typically around fixtures and club events. E.g. a basketball club that maps out the next month's social posts at a monthly committee meeting." },
          { value: "Weekly plan", label: "Weekly plan", tooltip: "Content is planned week by week with a clear schedule of posts, videos, and articles. E.g. a handball club that briefs its content volunteer on Monday with the week's planned posts, including a match preview, two training videos, and a post-match report." },
          { value: "Daily editorial calendar", label: "Daily editorial calendar", tooltip: "A daily content calendar is maintained and followed consistently. E.g. a professional rugby club with a content manager who plans and executes daily posts across all platforms, with review meetings every Monday morning." },
          { value: "Real-time content operation", label: "Real-time content operation", tooltip: "A fully staffed, real-time content operation responds to breaking news, live events, and audience behaviour immediately. E.g. an elite football club with a content team that live-posts during matches, responds to trending topics within minutes, and adapts the content calendar dynamically based on analytics." },
        ],
      },
      {
        id: "brandArchitecture",
        label: "Formal brand architecture / guidelines?",
        questionDescription: "Formal brand architecture — logo usage rules, colour palettes, typography, tone of voice guidelines — ensures that every touchpoint communicates a consistent, professional identity. Clubs with strong brand governance look more credible to sponsors, attract better commercial deals, and build recognition faster among new fans.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No", label: "No", tooltip: "No formal brand guidelines exist. E.g. different staff members use different versions of the club logo, varying colours, and inconsistent fonts across the website, social media, and printed materials." },
          { value: "Basic logo guide", label: "Basic logo guide", tooltip: "A basic document specifies correct logo usage and primary colours. E.g. a cricket club that has produced a one-page PDF telling volunteers which version of the badge to use and what the official club colours are." },
          { value: "Brand book", label: "Brand book", tooltip: "A comprehensive brand book covers logo, colour, typography, photography style, and tone of voice. E.g. a basketball club that has engaged a designer to produce a detailed brand document used by all staff and external suppliers." },
          { value: "Full architecture + governance", label: "Full architecture + governance", tooltip: "Brand architecture covers the full club family — first team, academy, women's team, community foundation — with governance processes to enforce consistency. E.g. a professional rugby club that reviews all external communications against brand guidelines before publication." },
          { value: "Living brand system", label: "Living brand system", tooltip: "A digital-first brand system that is regularly updated, version-controlled, and accessible to all staff and partners in real time. E.g. an elite football club whose entire brand toolkit lives in a cloud platform, updated after each rebrand, and automatically distributed to all commercial partners and content suppliers." },
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
        questionDescription: "Broadcasting and streaming reach determines how large an audience can watch your club's matches, expanding the fanbase and commercial value well beyond those who can attend in person. Broadcast rights are one of the highest-value commercial assets a club can offer sponsors and governing bodies.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "No broadcasting", label: "No broadcasting", tooltip: "Matches are not broadcast or streamed anywhere. E.g. a grassroots handball club whose games are attended only in person with no digital viewing option." },
          { value: "Local only", label: "Local only", tooltip: "Matches are broadcast or streamed to a local or single-city audience. E.g. a basketball club that live-streams home games on its own Facebook page for local fans who cannot attend." },
          { value: "Regional", label: "Regional", tooltip: "Matches are broadcast to a multi-city or regional audience. E.g. a cricket club whose matches appear on a regional sports channel covering several counties or states." },
          { value: "National", label: "National", tooltip: "Matches are broadcast or streamed to a national audience. E.g. a professional rugby club featured on a national sports broadcaster as part of a league media rights agreement." },
          { value: "International", label: "International", tooltip: "Matches reach an international audience through broadcast or streaming platforms. E.g. an elite football club whose matches are broadcast in 50+ countries under a global media rights deal." },
        ],
      },
      // === T4+ additions ===
      {
        id: "documentaryPresence",
        label: "Documentary / behind-the-scenes content",
        questionDescription: "Documentary and behind-the-scenes content — from short social media features to full-length produced series — humanises a club's story, generates viral reach, and attracts fans who may never attend a match. The success of productions like 'Drive to Survive' (F1), 'All or Nothing' (various sports), and 'Break Point' (tennis) demonstrates that compelling documentary content can transform global fanbases.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None", tooltip: "No documentary or behind-the-scenes content has been produced. E.g. the club's content is limited to match highlights, training clips, and results updates." },
          { value: "One-off features", label: "One-off features", tooltip: "Occasional short documentary features, typically produced for anniversary milestones or significant moments. E.g. a cricket club that produced a five-minute film for its centenary year but has no regular documentary output." },
          { value: "Regular series", label: "Regular series", tooltip: "A consistent documentary series — either short-form on social media or longer-form on YouTube — gives fans regular behind-the-scenes access. E.g. a basketball club that produces a weekly 'Inside the Club' series during the season, generating a loyal audience." },
          { value: "Premium production", label: "Premium production", tooltip: "High-quality, professionally produced documentary content. E.g. a professional rugby club that has partnered with a production company to release a season-long documentary series on a streaming platform." },
          { value: "Original programming", label: "Original programming", tooltip: "The club produces broadcast-quality original programming — series, documentaries, and features — at a level comparable to professional media companies. E.g. an elite football club with a Netflix-quality club channel producing multiple original series per year, generating millions of global views and significant commercial and brand value." },
        ],
      },
      {
        id: "culturalTranscendence",
        label: "Does the club transcend sport into broader culture?",
        questionDescription: "The most powerful sports clubs are cultural institutions — they shape music, fashion, language, and identity far beyond the boundaries of sport itself. Cultural transcendence is a qualitative measure of whether your club has achieved this status locally, regionally, nationally, or internationally, and it is one of the most powerful drivers of long-term fan acquisition and commercial premium.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No", tooltip: "The club's identity is purely sporting with no broader cultural impact. E.g. a functional club that is respected in its community but has not crossed over into wider cultural life." },
          { value: "Some local cultural role", label: "Some local cultural role", tooltip: "The club plays a meaningful role in local community identity and is associated with local pride. E.g. a small-town rugby club whose matchday is a central part of the local social calendar, referenced in community events and local media beyond sport." },
          { value: "Regional cultural icon", label: "Regional cultural icon", tooltip: "The club is a recognised cultural institution within its region — not just a sports club. E.g. a cricket or basketball club that is woven into regional identity, generates local political and civic interest, and has become a symbol of regional pride." },
          { value: "National cultural relevance", label: "National cultural relevance", tooltip: "The club has a presence in national cultural conversation — referenced in mainstream media, political discourse, music, or fashion beyond sport. E.g. a top-flight football or rugby club whose matches, players, or controversies are discussed in non-sports national media regularly." },
          { value: "International cultural brand", label: "International cultural brand", tooltip: "The club is a globally recognised cultural phenomenon transcending sport. E.g. clubs like FC Barcelona, the All Blacks, or the LA Lakers whose brand, style, and identity are recognised and respected globally regardless of any individual result or season." },
        ],
      },
      {
        id: "earnedMediaValue",
        label: "Do you track earned media value?",
        questionDescription: "Earned media value (EMV) is the estimated financial worth of all media coverage a club receives for free — through press articles, social media mentions, broadcast features, and influencer posts — as if that exposure had been purchased as paid advertising. Tracking EMV allows clubs to quantify their media footprint and demonstrate value to sponsors.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "No", label: "No", tooltip: "The club does not monitor or estimate the value of its media coverage. E.g. there is no process for tracking press mentions, no media clipping service, and no way to quantify coverage to sponsors." },
          { value: "Ad-hoc estimates", label: "Ad-hoc estimates", tooltip: "Occasional rough estimates of media value are made, typically for specific events. E.g. a rugby club that estimates the media value of its cup run coverage after the fact to include in a sponsor renewal presentation." },
          { value: "Regular tracking", label: "Regular tracking", tooltip: "Media coverage is monitored consistently and a regular EMV figure is calculated. E.g. a basketball club using a media monitoring service to track all mentions and estimate their advertising equivalent value monthly." },
          { value: "Full attribution model", label: "Full attribution model", tooltip: "A comprehensive EMV model tracks all coverage across all channels in real time, attributing value by outlet, format, and sponsor mention. E.g. an elite football club using a specialist media analytics platform that calculates real-time sponsor EMV from broadcast footage, social mentions, and digital articles, feeding directly into sponsor reporting." },
        ],
      },
      {
        id: "globalMediaRightsStrat",
        label: "Global media rights strategy",
        questionDescription: "For T5 clubs, media rights — the agreements governing who broadcasts your matches and how — are typically the single most valuable commercial asset in the entire portfolio. A proactive global media rights strategy ensures the club maximises broadcast revenue, reaches the largest possible global audience, and maintains control over how its intellectual property is distributed worldwide.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "No strategy", label: "No strategy", tooltip: "Media rights are not actively managed as a strategic commercial asset. E.g. rights are sold reactively when approached by broadcasters, without analysis of market value or long-term audience development goals." },
          { value: "Ad-hoc deals", label: "Ad-hoc deals", tooltip: "Individual broadcast deals are negotiated on an opportunistic basis without a coherent strategy. E.g. a T5 club that has sold rights to two or three overseas markets individually but has no overall framework for rights packaging and pricing." },
          { value: "Regional packages", label: "Regional packages", tooltip: "Rights are packaged and sold by territory on a structured basis. E.g. a T5 football club with a dedicated media rights team that bundles regional broadcast packages for Europe, Asia, and the Americas and sells them through a rights agency." },
          { value: "Global portfolio", label: "Global portfolio", tooltip: "A comprehensive global media rights strategy maximises revenue across all territories and formats — broadcast, streaming, highlights, and short-form — with long-term rights deals providing financial stability and audience growth at scale. E.g. an elite club managing its global rights portfolio through a combination of league deals, direct OTT licensing, and territory-by-territory broadcast agreements." },
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
        questionDescription: "The trajectory of competitive results over the most recent three seasons tells a more meaningful story than any single season's performance. A club that has improved from mid-table to a championship challenge, or avoided relegation for three consecutive seasons, demonstrates sporting health and strategic effectiveness — which attracts players, sponsors, and fans far more than historical legacy alone.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Declining", label: "Declining", tooltip: "Performance has deteriorated over the past three seasons. E.g. a basketball club that finished third three years ago, seventh last year, and is currently bottom half this season." },
          { value: "Stable bottom half", label: "Stable bottom half", tooltip: "The club consistently finishes in the lower half of its competition without improvement. E.g. a handball club that has finished between eighth and twelfth for three consecutive seasons in a twelve-team league." },
          { value: "Stable top half", label: "Stable top half", tooltip: "The club consistently finishes in the upper half without significant trend. E.g. a cricket club that has been fourth to sixth for three years — solid but without upward momentum." },
          { value: "Improving", label: "Improving", tooltip: "League position has improved meaningfully over the three-season window. E.g. a rugby club that finished twelfth, then eighth, then fourth over three successive seasons." },
          { value: "Consistently top", label: "Consistently top", tooltip: "The club has finished at or near the top of its competition for three or more seasons. E.g. an ice hockey club that has won the league once and finished in the top three every year for the last three seasons." },
        ],
      },
      {
        id: "performanceAnalytics",
        label: "Do you use performance analytics or sport science?",
        questionDescription: "The use of performance analytics and sports science — from basic statistics through to AI-driven performance modelling — enables coaching staff to make more informed decisions about player selection, training load, injury prevention, and tactical planning. Clubs that invest in analytics gain a measurable competitive edge and attract high-calibre players who want to develop in a data-informed environment.",
        type: "radio-cards",
        minTier: 1,
        options: [
          { value: "No", label: "No", tooltip: "No formal performance data collection or analysis. E.g. coaching decisions are made entirely based on subjective observation, with no statistical record of player or team performance." },
          { value: "Basic stats", label: "Basic stats", tooltip: "Simple performance statistics are tracked. E.g. a basketball club that records points, rebounds, and assists for each game but does not use advanced metrics or technology." },
          { value: "Some analytics", label: "Some analytics", tooltip: "Performance data is collected and used to inform specific decisions. E.g. a rugby club that uses GPS tracking during training to monitor player load and prevent soft-tissue injuries." },
          { value: "Dedicated department", label: "Dedicated department", tooltip: "A sports science and analytics department exists with dedicated staff. E.g. a professional handball club with a performance analyst and a physiologist who jointly review weekly data and present findings to the head coach." },
          { value: "Advanced integrated system", label: "Advanced integrated system", tooltip: "Performance analytics, medical data, video analysis, and tactical modelling are fully integrated into a single coaching platform. E.g. an elite football club where GPS data, injury history, opponent scouting, and player ratings are combined in real time to support training design and matchday selection." },
        ],
      },
      // === T1+ additions ===
      {
        id: "competitiveGoalAlignment",
        label: "Competitive goals vs. actual results alignment",
        questionDescription: "The degree to which actual competitive results align with stated ambitions measures whether a club is executing its sporting strategy effectively. A club that consistently meets or exceeds its goals has aligned resources, coaching quality, and squad depth — making it a more credible destination for players, staff, and sponsors who want to be associated with a well-run organisation.",
        type: "radio-cards",
        minTier: 1,
        freeTier: true,
        options: [
          { value: "Far below", label: "Far below", tooltip: "Results are substantially worse than stated targets. E.g. a basketball club that set a top-four target but finished tenth — suggesting misaligned resources, coaching, or squad quality." },
          { value: "Below", label: "Below", tooltip: "Results fall short of targets but not dramatically. E.g. a rugby club that targeted promotion but finished mid-table, missing the required improvement in performance." },
          { value: "Meeting", label: "Meeting", tooltip: "Results broadly align with what the club set out to achieve. E.g. a handball club that targeted a top-six finish and delivered exactly that — competent execution of a realistic plan." },
          { value: "Exceeding", label: "Exceeding", tooltip: "Results are meaningfully better than targets. E.g. a cricket club that targeted league survival but finished third, exceeded expectations, and reached the knockout rounds of a cup competition." },
          { value: "Far exceeding", label: "Far exceeding", tooltip: "Results dramatically surpass all stated goals. E.g. an ice hockey club that targeted a mid-table finish but won the league championship — a remarkable overperformance relative to resources and pre-season expectations." },
        ],
      },
      {
        id: "trophiesRecentYears",
        label: "Trophies, titles, or promotions in last 5 years",
        questionDescription: "Trophies, titles, and promotions won in the last five years provide tangible evidence of competitive success, which is a powerful attractor for players, sponsors, and fans. Recent silverware is weighted more heavily than historical glory, as it reflects the current squad, coaching staff, and club infrastructure.",
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
        questionDescription: "Participation in continental or major cup competitions — UEFA competitions in football, FIBA Champions League in basketball, Heineken Champions Cup in rugby, or ICC tournaments in cricket — dramatically expands a club's audience, commercial reach, media value, and talent attraction. This question measures how regularly the club competes at the highest level beyond domestic competition.",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "Never", label: "Never", tooltip: "The club has not participated in continental or major cup competition. E.g. a domestic league club that has never qualified for or been invited to participate in cross-border competition." },
          { value: "Occasionally", label: "Occasionally (1 in 5 yrs)", tooltip: "One participation in continental or major cup competition in the last five seasons. E.g. a basketball club that qualified for the EuroCup once but did not sustain that level." },
          { value: "Regular", label: "Regular (2 – 3 in 5 yrs)", tooltip: "Two to three appearances in continental or major cup competition in the last five years. E.g. a football club that qualifies for European competition in most seasons but is not a permanent fixture." },
          { value: "Most years", label: "Most years", tooltip: "The club competes in continental or cup competition in most seasons. E.g. a football club that qualifies for European competition in four of every five years, typically entering at the preliminary rounds." },
          { value: "Every year", label: "Every year", tooltip: "The club is a permanent fixture in continental and major cup competition. E.g. an elite club that participates in the highest level of continental competition every season as a matter of right, not qualification." },
        ],
      },
      {
        id: "performanceDepartmentSize",
        label: "Performance / sports science staff",
        questionDescription: "The number of staff dedicated to performance, sports science, and physical conditioning directly reflects the club's investment in player welfare and competitive preparation. A well-resourced performance department reduces injury rates, extends player careers, and provides a tangible attraction for players who want to compete at the highest level of their ability.",
        type: "radio-cards",
        minTier: 2,
        options: [
          { value: "0", label: "0", tooltip: "No dedicated performance or sports science staff. E.g. a club where conditioning is managed by the coaching staff alongside all other responsibilities." },
          { value: "1", label: "1", tooltip: "A single performance professional covers all sports science needs. E.g. a semi-professional rugby club with one part-time physiotherapist shared across all squads." },
          { value: "2-3", label: "2 – 3", tooltip: "A small performance team covering the most essential functions. E.g. a basketball club with a head of performance and a physiotherapist who jointly manage load monitoring, injury rehabilitation, and pre-match preparation." },
          { value: "4-6", label: "4 – 6", tooltip: "A well-resourced performance department. E.g. a professional handball club with a performance director, two physiotherapists, a strength and conditioning coach, and a sports nutritionist." },
          { value: "7+", label: "7+", tooltip: "A large, specialist performance department comparable to the best in the sport. E.g. an elite football or basketball club with a full department including sports scientists, physiotherapists, psychologists, nutritionists, and strength and conditioning coaches." },
        ],
      },
      // === T3+ additions ===
      {
        id: "peerBenchmarking",
        label: "How often do you benchmark against peers?",
        questionDescription: "Benchmarking against peer clubs — comparing performance metrics, commercial indicators, and operational standards against clubs of similar size and tier — is one of the most efficient ways to identify competitive gaps and direct investment effectively. Clubs that benchmark regularly make better-informed strategic decisions than those operating without external reference points.",
        type: "radio-cards",
        minTier: 3,
        options: [
          { value: "Never", label: "Never", tooltip: "The club has never formally compared its performance or metrics against peer clubs. E.g. operational and commercial decisions are made based on internal history and intuition alone." },
          { value: "Annually", label: "Annually", tooltip: "Benchmarking is conducted once per year. E.g. an end-of-season review that compares the club's attendance, social following, and commercial income against a selection of comparable clubs." },
          { value: "Semi-annually", label: "Semi-annually", tooltip: "Benchmarking occurs twice per year. E.g. a mid-season and end-of-season review that tracks competitive and commercial metrics against five peer clubs identified at the start of the season." },
          { value: "Quarterly", label: "Quarterly", tooltip: "Regular quarterly benchmarking reviews. E.g. a professional basketball club that reviews its performance, commercial, and fan metrics against a peer group every three months and updates strategy accordingly." },
          { value: "Continuously", label: "Continuously", tooltip: "Real-time or near-real-time benchmarking is embedded in operational dashboards. E.g. an elite club using a sports intelligence platform that tracks competitive, commercial, and fan metrics against peer clubs continuously, alerting management to material changes immediately." },
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
        questionDescription: "Global competitive position reflects where your club stands in the worldwide hierarchy of clubs competing in your sport — not just domestically, but in terms of playing quality, squad depth, and international reputation. This self-assessed metric provides context for the SCAS score and calibrates expectations for talent attraction, media value, and commercial performance.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "Bottom 50%", label: "Bottom 50%", tooltip: "The club ranks below the median globally in terms of competitive standing. E.g. a club competing in lower national divisions or a regional competition without wider international recognition." },
          { value: "Lower-middle", label: "Lower-middle", tooltip: "The club is above average in its domestic market but not among the elite. E.g. a mid-table top-division club that is competitive domestically but does not feature in continental competition." },
          { value: "Upper-middle", label: "Upper-middle", tooltip: "The club is considered a strong domestic performer and is occasionally competitive at continental level. E.g. a consistent top-four domestic club that participates in continental competition in most seasons." },
          { value: "Top 25%", label: "Top 25%", tooltip: "The club is among the elite in its sport globally. E.g. a club that is perennially competitive in the top domestic competition and a regular participant in the highest level of continental competition." },
          { value: "Top 10%", label: "Top 10%", tooltip: "The club is one of the defining clubs of its sport at a global level. E.g. an elite club that is globally recognised as a benchmark for excellence in playing performance, development, and sporting ambition." },
        ],
      },
      {
        id: "performanceInnovation",
        label: "Performance innovation investment",
        questionDescription: "Performance innovation — investment in new training methodologies, emerging sports science technology, research collaborations, and proprietary performance systems — creates sustainable competitive advantages that are difficult for rivals to replicate quickly. Clubs that lead in performance innovation typically recruit better, develop players more effectively, and win more consistently over the long term.",
        type: "radio-cards",
        minTier: 4,
        options: [
          { value: "None", label: "None", tooltip: "No investment in performance innovation. E.g. the club follows standard training practices for its level with no experimentation or research investment." },
          { value: "Ad-hoc projects", label: "Ad-hoc projects", tooltip: "Occasional one-off innovations without sustained investment. E.g. a rugby club that trialled a wearable fatigue monitoring device for one pre-season but did not integrate it into ongoing practice." },
          { value: "Budget allocated", label: "Budget allocated", tooltip: "A defined budget for performance innovation allows for consistent experimentation. E.g. a basketball club that allocates $50,000 per season to trialling new analytics tools, training equipment, and sports science methodologies." },
          { value: "Innovation team", label: "Innovation team", tooltip: "A dedicated team is responsible for performance innovation. E.g. a professional handball club with a performance innovation lead who manages relationships with university research partners and external technology providers." },
          { value: "Industry-leading R&D", label: "Industry-leading R&D", tooltip: "The club is at the frontier of performance science, conducting original research and setting standards adopted by other clubs and governing bodies. E.g. an elite club whose performance innovations — from novel training periodisation models to AI injury prediction — are published in academic journals and benchmarked by national federations." },
        ],
      },
      {
        id: "innovationDepartment",
        label: "Dedicated innovation department",
        questionDescription: "A dedicated innovation department signals that the club views broad strategic innovation — spanning commercial, digital, operational, and performance domains — as a core competitive advantage rather than a peripheral activity. This T5 question measures the organisational commitment to continuous innovation across the entire club.",
        type: "radio-cards",
        minTier: 5,
        options: [
          { value: "None", label: "None", tooltip: "No dedicated innovation function. E.g. innovation is discussed at board level but there is no person or team with a mandate or budget to drive it." },
          { value: "Informal", label: "Informal", tooltip: "Innovation happens through the initiative of interested individuals without formal structure or budget. E.g. a T5 club where the commercial director informally champions new ideas but there is no coordinated innovation programme." },
          { value: "Allocated budget", label: "Allocated budget", tooltip: "A formal innovation budget exists and is spent against defined priorities. E.g. a T5 basketball club that allocates a six-figure annual innovation budget covering digital products, performance technology, and fan experience experiments." },
          { value: "Dedicated team", label: "Dedicated team", tooltip: "A dedicated innovation team with a formal remit covers strategic innovation across the club. E.g. a professional football club with an innovation director, two innovation managers, and a network of external research partners working on commercial, performance, and fan experience projects simultaneously." },
          { value: "Industry-leading R&D", label: "Industry-leading R&D", tooltip: "The club operates a world-class innovation and research function that sets standards for the sport as a whole. E.g. an elite club whose innovation lab develops proprietary technology — from data platforms to fan engagement products — that is licensed to other clubs, generating additional commercial revenue and international recognition." },
        ],
      },
    ],
  },
];

export const DIMENSION_META: Record<string, { label: string; icon: string; weight: string; color: string }> = {
  fan: { label: "Fan Attraction", icon: "Heart", weight: "", color: "hsl(177, 98%, 22%)" },
  commercial: { label: "Commercial Attraction", icon: "TrendingUp", weight: "", color: "hsl(38, 92%, 50%)" },
  talent: { label: "Talent Attraction", icon: "Users", weight: "", color: "hsl(262, 60%, 48%)" },
  media: { label: "Media & Cultural", icon: "Megaphone", weight: "", color: "hsl(142, 70%, 35%)" },
  competitive: { label: "Competitive Attraction", icon: "Trophy", weight: "", color: "hsl(0, 70%, 50%)" },
};
