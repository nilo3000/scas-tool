import type { ScasScores, DimensionScore, Initiative, ScoreDriverEntry, DimensionDrivers } from "@shared/schema";

// ─── ANSWER SCORES ──────────────────────────────────────────────────────────
// Each answer option maps to a 1.0–5.0 score.

const ANSWER_SCORES: Record<string, Record<string, number>> = {
  // ═══ FAN ATTRACTION ═══════════════════════════════════════════════════════
  socialFollowers: {
    "<5K": 1.0, "5K-25K": 2.0, "25K-100K": 3.0, "100K-500K": 3.8, "500K-2M": 4.5, "2M+": 5.0,
  },
  attendanceCapacity: {
    "<30%": 1.5, "30-50%": 2.5, "50-70%": 3.2, "70-85%": 4.0, "85%+": 4.8,
  },
  fanDatabase: {
    "No": 1.0, "Basic spreadsheet": 2.0, "Dedicated CRM": 3.5, "Advanced with segmentation": 4.8,
  },
  activeMembersCount: {
    "<100": 1.0, "100-500": 2.0, "500-2K": 3.0, "2K-5K": 4.0, "5K+": 5.0,
  },
  fanCommunicationFreq: {
    "Never": 1.0, "Monthly": 2.0, "Bi-weekly": 3.0, "Weekly": 4.0, "Multiple per week": 5.0,
  },
  communityEventCount: {
    "0-2": 1.2, "3-5": 2.2, "6-12": 3.2, "12-24": 4.2, "24+": 5.0,
  },
  seasonTicketRenewal: {
    "<40%": 1.2, "40-60%": 2.2, "60-75%": 3.2, "75-85%": 4.0, "85%+": 4.8,
  },
  matchdayExperience: {
    "Poor": 1.0, "Below average": 2.0, "Average": 3.0, "Good": 4.0, "Excellent": 5.0,
  },
  socialMediaActivePlatforms: {
    "1": 1.2, "2": 2.2, "3": 3.2, "4-5": 4.2, "6+": 5.0,
  },
  netPromoterScore: {
    "Don't measure": 1.0, "<20": 2.0, "20-40": 3.0, "40-60": 4.0, "60+": 5.0,
  },
  fanDatabaseCoveragePercent: {
    "<10%": 1.0, "10-25%": 2.0, "25-50%": 3.2, "50-75%": 4.2, "75%+": 5.0,
  },
  averageRevenuePerFan: {
    "<$5": 1.0, "$5-15": 2.0, "$15-40": 3.2, "$40-100": 4.2, "$100+": 5.0,
  },
  fanSegmentation: {
    "No": 1.0, "Basic demographics": 2.2, "Behavioral": 3.5, "Advanced predictive": 5.0,
  },
  fanLifetimeValue: {
    "No": 1.0, "Basic estimate": 2.5, "Calculated per segment": 3.8, "Fully modeled": 5.0,
  },
  loyaltyProgram: {
    "No": 1.0, "Basic points": 2.5, "Tiered program": 3.8, "Fully integrated": 5.0,
  },
  fanDataInfrastructure: {
    "No centralized data": 1.0, "Basic CRM": 2.2, "CDP/DMP": 3.8, "Unified real-time": 5.0,
  },

  // ═══ COMMERCIAL ATTRACTION ════════════════════════════════════════════════
  sponsorCount: {
    "0-2": 1.2, "3-5": 2.2, "6-10": 3.2, "11-20": 4.0, "20+": 4.8,
  },
  sponsorRevenueShare: {
    "<10%": 1.5, "10-20%": 2.5, "20-35%": 3.3, "35-50%": 4.0, "50%+": 4.5,
  },
  digitalMonetization: {
    "No": 1.0, "Basic social ads": 2.0, "Some digital packages": 3.3, "Comprehensive digital inventory": 4.7,
  },
  averageSponsorDealLength: {
    "<1yr": 1.0, "1yr": 2.0, "2yrs": 3.0, "3yrs": 4.0, "3+yrs": 5.0,
  },
  merchandiseRevenue: {
    "No merch": 1.0, "Minimal": 2.0, "Growing": 3.0, "Significant": 4.0, "Core revenue stream": 5.0,
  },
  hospitalityRevenue: {
    "None": 1.0, "Basic matchday": 2.0, "Some premium packages": 3.0, "Full hospitality program": 4.0, "Best-in-class premium": 5.0,
  },
  sponsorActivation: {
    "Passive logos only": 1.0, "Some matchday activation": 2.0, "Regular activations": 3.2, "Full multi-channel": 4.2, "Strategic co-creation": 5.0,
  },
  commercialRevenuePerSeat: {
    "<$100": 1.0, "$100-300": 2.0, "$300-800": 3.2, "$800-2000": 4.2, "$2000+": 5.0,
  },
  sponsorSatisfaction: {
    "Low": 1.0, "Moderate": 2.2, "Good": 3.2, "Very Good": 4.2, "Excellent": 5.0,
  },
  unfilledSponsorCategories: {
    // More unfilled = more opportunity, but also lower current commercial maturity
    // We invert: few unfilled = high score (already well-sold)
    "10+": 1.0, "7-10": 2.0, "4-6": 3.0, "2-3": 4.0, "0-1": 5.0,
  },
  digitalInventoryValue: {
    "<5%": 1.0, "5-10%": 2.0, "10-20%": 3.2, "20-35%": 4.2, "35%+": 5.0,
  },
  revenueConcentration: {
    "Top sponsor >50%": 1.0, "Top sponsor 30-50%": 2.0, "Top 3 = 50-70%": 3.0, "Well diversified": 4.0, "Highly diversified": 5.0,
  },
  brandValuation: {
    "No": 1.0, "Estimated internally": 2.5, "Third-party valuation": 3.8, "Regular valuation": 5.0,
  },
  commercialInnovation: {
    "None": 1.0, "Exploring": 2.5, "Some products live": 3.8, "Revenue-generating portfolio": 5.0,
  },
  internationalCommercialRevenue: {
    "<5%": 1.0, "5-15%": 2.5, "15-30%": 3.8, "30%+": 5.0,
  },

  // ═══ TALENT ATTRACTION ════════════════════════════════════════════════════
  playerAttraction: {
    "Very difficult": 1.2, "Somewhat difficult": 2.2, "Moderate": 3.0, "Good": 3.8, "Excellent": 4.7,
  },
  academyPathway: {
    "No": 1.0, "Informal": 2.0, "Structured but underfunded": 3.0, "Well-funded": 4.0, "Elite-level": 4.8,
  },
  coachingCertifications: {
    "None formal": 1.0, "Some certified": 2.0, "Mostly certified": 3.2, "All certified + CPD": 4.2, "High-profile coaching team": 5.0,
  },
  playerRetentionRate: {
    "Very low": 1.0, "Low": 2.0, "Moderate": 3.0, "Good": 4.0, "Excellent": 5.0,
  },
  volunteerCoachRatio: {
    "All volunteer": 1.0, "Mostly volunteer": 2.0, "Mixed": 3.0, "Mostly qualified": 4.0, "Fully professional": 5.0,
  },
  scoutingNetwork: {
    "None": 1.0, "Local only": 2.0, "Regional": 3.0, "National": 4.0, "International": 5.0,
  },
  staffDevelopmentBudget: {
    "None": 1.0, "Minimal": 2.0, "Moderate": 3.0, "Significant": 4.0, "Industry-leading": 5.0,
  },
  academyToFirstTeam: {
    "No academy": 1.0, "<5%": 2.0, "5-10%": 3.0, "10-20%": 4.0, "20%+": 5.0,
  },
  performanceTechUsage: {
    "None": 1.0, "Basic GPS/video": 2.0, "Some analytics": 3.0, "Full suite": 4.2, "AI/ML-integrated": 5.0,
  },
  internationalScoutingReach: {
    "None": 1.0, "1-2 countries": 2.0, "Regional": 3.0, "Continental": 4.0, "Global": 5.0,
  },
  wageToRevenueRatio: {
    // Lower wage ratio = more sustainable / better managed
    "<40%": 5.0, "40-55%": 4.0, "55-65%": 3.0, "65-75%": 2.0, ">75%": 1.0,
  },
  talentDataInfrastructure: {
    "Basic spreadsheets": 1.0, "Database": 2.0, "Scouting platform": 3.2, "Advanced analytics": 4.2, "Predictive models": 5.0,
  },
  playerDevelopmentTracking: {
    "None": 1.0, "Basic notes": 2.0, "KPI-based": 3.2, "Full development profiles": 4.2, "AI-assisted plans": 5.0,
  },

  // ═══ MEDIA & CULTURAL ATTRACTION ══════════════════════════════════════════
  contentOutput: {
    "Minimal/ad-hoc": 1.0, "1-5 pieces/week": 2.2, "Daily content": 3.2, "Multiple daily": 4.0, "Professional content operation": 4.8,
  },
  mediaCoverage: {
    "Rarely mentioned": 1.0, "Occasional": 2.0, "Regular coverage": 3.2, "Featured weekly": 4.0, "Constant coverage": 4.8,
  },
  dedicatedContentPerson: {
    "No one": 1.0, "Part-time volunteer": 2.0, "One dedicated person": 3.0, "Small team": 4.0, "Full content department": 5.0,
  },
  localMediaPartnerships: {
    "None": 1.0, "1": 2.0, "2-3": 3.0, "4-5": 4.0, "5+": 5.0,
  },
  communityStorytellingEvents: {
    "0": 1.0, "1-3": 2.0, "4-8": 3.0, "9-15": 4.0, "15+": 5.0,
  },
  websiteTraffic: {
    "<1K": 1.0, "1K-5K": 2.0, "5K-25K": 3.0, "25K-100K": 4.0, "100K+": 5.0,
  },
  contentPlatforms: {
    "1": 1.0, "2-3": 2.2, "4-5": 3.2, "6-7": 4.2, "8+": 5.0,
  },
  contentProductionCadence: {
    "No plan": 1.0, "Monthly plan": 2.0, "Weekly plan": 3.2, "Daily editorial calendar": 4.2, "Real-time content operation": 5.0,
  },
  brandArchitecture: {
    "No": 1.0, "Basic logo guide": 2.0, "Brand book": 3.0, "Full architecture + governance": 4.2, "Living brand system": 5.0,
  },
  estimatedMediaValue: {
    "Don't know": 1.0, "<$500K": 2.0, "$500K-2M": 3.2, "$2M-10M": 4.2, "$10M+": 5.0,
  },
  broadcastingReach: {
    "No broadcasting": 1.0, "Local only": 2.0, "Regional": 3.0, "National": 4.0, "International": 5.0,
  },
  documentaryPresence: {
    "None": 1.0, "One-off features": 2.2, "Regular series": 3.5, "Premium production": 4.5, "Original programming": 5.0,
  },
  culturalTranscendence: {
    "No": 1.0, "Some local cultural role": 2.0, "Regional cultural icon": 3.2, "National cultural relevance": 4.2, "International cultural brand": 5.0,
  },
  earnedMediaValue: {
    "No": 1.0, "Ad-hoc estimates": 2.5, "Regular tracking": 3.8, "Full attribution model": 5.0,
  },

  // ═══ COMPETITIVE ATTRACTION ═══════════════════════════════════════════════
  leaguePositionTrend: {
    "Declining": 1.2, "Stable bottom half": 2.2, "Stable top half": 3.2, "Improving": 4.0, "Consistently top": 4.8,
  },
  performanceAnalytics: {
    "No": 1.0, "Basic stats": 2.0, "Some analytics": 3.0, "Dedicated department": 4.0, "Advanced integrated system": 4.8,
  },
  competitiveGoalAlignment: {
    "Far below": 1.0, "Below": 2.0, "Meeting": 3.0, "Exceeding": 4.0, "Far exceeding": 5.0,
  },
  trophiesRecentYears: {
    "0": 1.0, "1": 2.5, "2": 3.5, "3": 4.2, "4+": 5.0,
  },
  continentalCompetition: {
    "Never": 1.0, "Occasionally": 2.0, "Regular": 3.2, "Most years": 4.2, "Every year": 5.0,
  },
  performanceDepartmentSize: {
    "0": 1.0, "1": 2.0, "2-3": 3.0, "4-6": 4.0, "7+": 5.0,
  },
  peerBenchmarking: {
    "Never": 1.0, "Annually": 2.2, "Semi-annually": 3.2, "Quarterly": 4.2, "Continuously": 5.0,
  },
  dataDecisionMaking: {
    "Gut feel": 1.0, "Some data": 2.0, "Data-informed": 3.0, "Data-driven": 4.2, "AI-assisted": 5.0,
  },
  budgetPerformanceEfficiency: {
    "Well below": 1.0, "Below": 2.0, "Average": 3.0, "Above": 4.0, "Well above": 5.0,
  },
  globalCompetitivePosition: {
    "Bottom 50%": 1.0, "Lower-middle": 2.0, "Upper-middle": 3.0, "Top 25%": 4.0, "Top 10%": 5.0,
  },
  performanceInnovation: {
    "None": 1.0, "Ad-hoc projects": 2.0, "Budget allocated": 3.0, "Innovation team": 4.0, "Industry-leading R&D": 5.0,
  },

  // ═══ T5-EXCLUSIVE QUESTIONS ═══════════════════════════════════════════════
  multiClubOwnership: {
    "No": 1.0, "Exploring": 2.5, "Affiliated network": 3.8, "Fully integrated MCO": 5.0,
  },
  globalMediaRightsStrat: {
    "No strategy": 1.0, "Ad-hoc deals": 2.5, "Regional packages": 3.5, "Global portfolio": 5.0,
  },
  esgReportingMaturity: {
    "None": 1.0, "Internal only": 2.0, "Annual report": 3.2, "Fully integrated": 5.0,
  },
  digitalProductRevenue: {
    "None": 1.0, "1 product": 2.5, "2-3 products": 3.8, "Full digital ecosystem": 5.0,
  },
  playerIpCommerc: {
    "None": 1.0, "Ad-hoc": 2.5, "Structured program": 3.8, "Core revenue stream": 5.0,
  },
  globalFanResearch: {
    "Never": 1.0, "Ad-hoc": 2.0, "Annual": 3.0, "Bi-annual segmented": 4.2, "Continuous panel": 5.0,
  },
  talentBrandGlobal: {
    "Unknown": 1.0, "Known regionally": 2.5, "National top employer": 3.8, "Global destination": 5.0,
  },
  innovationDepartment: {
    "None": 1.0, "Informal": 2.0, "Allocated budget": 3.2, "Dedicated team": 4.2, "Industry-leading R&D": 5.0,
  },
};

// ─── TIER-ADJUSTED ANSWER SCORES ────────────────────────────────────────────
// [T-ADJ] questions have breakpoint scores that vary by tier.
// getScore checks this map first; falls back to flat ANSWER_SCORES above.

const TIER_ANSWER_SCORES: Record<string, Record<number, Record<string, number>>> = {
  socialFollowers: {
    1: { "<500": 1.0, "500-2K": 2.0, "2K-10K": 3.0, "10K-50K": 4.0, "50K-200K": 4.8, "200K+": 5.0 },
    2: { "<2K": 1.0, "2K-10K": 2.0, "10K-50K": 3.0, "50K-200K": 3.8, "200K-750K": 4.5, "750K+": 5.0 },
    3: { "<10K": 1.0, "10K-50K": 2.0, "50K-250K": 2.8, "250K-750K": 3.5, "750K-2M": 4.0, "2M+": 5.0 },
    4: { "<100K": 1.0, "100K-500K": 1.5, "500K-2M": 2.0, "2M-10M": 3.5, "10M-50M": 4.2, "50M+": 5.0 },
    5: { "<1M": 1.0, "1M-5M": 1.5, "5M-20M": 2.0, "20M-80M": 2.8, "80M-250M": 4.2, "250M+": 5.0 },
  },
  attendanceCapacity: {
    1: { "<30%": 1.0, "30-50%": 2.0, "50-70%": 3.5, "70-85%": 4.5, "85-92%": 5.0 },
    2: { "<30%": 1.0, "30-50%": 2.0, "50-70%": 3.2, "70-85%": 4.2, "85-92%": 4.8 },
    3: { "<30%": 1.2, "30-50%": 2.2, "50-70%": 3.0, "70-85%": 3.8, "85-92%": 4.5, "92%+": 5.0 },
    4: { "<30%": 1.5, "30-50%": 2.5, "50-70%": 3.0, "70-85%": 3.5, "85-92%": 4.2, "92%+": 4.8 },
    5: { "<30%": 1.5, "30-50%": 2.5, "50-70%": 2.8, "70-85%": 3.2, "85-92%": 3.8, "92%+": 5.0 },
  },
  activeMembersCount: {
    1: { "<50": 1.0, "100-500": 2.0, "500-2K": 3.2, "2K-5K": 4.2, "5K-15K": 5.0 },
    2: { "<100": 1.0, "100-500": 1.5, "500-2K": 2.5, "2K-5K": 3.5, "5K-15K": 4.5, "15K-50K": 5.0 },
    3: { "100-500": 1.0, "500-2K": 1.5, "2K-5K": 2.5, "5K-15K": 3.5, "15K-50K": 4.5, "50K-150K": 5.0 },
    4: { "500-2K": 1.0, "2K-5K": 1.5, "5K-15K": 2.5, "15K-50K": 3.5, "50K-150K": 4.5, "150K-300K": 5.0 },
    5: { "2K-5K": 1.0, "5K-15K": 1.5, "15K-50K": 2.5, "50K-150K": 3.5, "150K-300K": 4.5, "300K+": 5.0 },
  },
  seasonTicketRenewal: {
    // T2+ only (no T1)
    2: { "<30%": 1.0, "30-50%": 2.0, "50-65%": 3.2, "65-80%": 4.0, "80-88%": 4.8 },
    3: { "<30%": 1.2, "30-50%": 2.0, "50-65%": 2.8, "65-80%": 3.5, "80-88%": 4.2, "88-92%": 5.0 },
    4: { "<30%": 1.2, "30-50%": 2.0, "50-65%": 2.5, "65-80%": 3.0, "80-88%": 3.8, "88-92%": 4.5, "92%+": 5.0 },
    5: { "<30%": 1.2, "30-50%": 2.0, "50-65%": 2.2, "65-80%": 2.8, "80-88%": 3.2, "88-92%": 4.0, "92%+": 5.0 },
  },
  averageRevenuePerFan: {
    // T3+ only
    3: { "<$5": 1.0, "$5-15": 2.0, "$15-40": 3.2, "$40-100": 4.2, "$100-250": 5.0 },
    4: { "<$5": 1.0, "$5-15": 1.5, "$15-40": 2.0, "$40-100": 3.0, "$100-250": 4.0, "$250-500": 4.8, "$500+": 5.0 },
    5: { "<$5": 1.0, "$5-15": 1.0, "$15-40": 1.5, "$40-100": 2.0, "$100-250": 3.2, "$250-500": 4.2, "$500+": 5.0 },
  },
  sponsorCount: {
    1: { "0-2": 1.2, "3-5": 2.2, "6-10": 3.5, "11-20": 4.5, "21-35": 5.0 },
    2: { "0-2": 1.2, "3-5": 2.0, "6-10": 3.0, "11-20": 4.0, "21-35": 4.8 },
    3: { "0-2": 1.0, "3-5": 1.5, "6-10": 2.5, "11-20": 3.5, "21-35": 4.2, "36-50": 5.0 },
    4: { "0-2": 1.0, "3-5": 1.2, "6-10": 1.8, "11-20": 2.5, "21-35": 3.5, "36-50": 4.5, "51-70": 5.0 },
    5: { "0-2": 1.0, "3-5": 1.0, "6-10": 1.2, "11-20": 1.8, "21-35": 2.5, "36-50": 3.5, "51-70": 4.5, "70+": 5.0 },
  },
  estimatedMediaValue: {
    // T3+ only
    3: { "Don't know": 1.0, "<$500K": 2.0, "$500K-$2M": 3.5, "$2M-$10M": 4.5, "$10M-$50M": 5.0 },
    4: { "Don't know": 1.0, "<$500K": 1.5, "$500K-$2M": 2.0, "$2M-$10M": 3.0, "$10M-$50M": 4.2, "$50M-$200M": 5.0 },
    5: { "Don't know": 1.0, "<$500K": 1.0, "$500K-$2M": 1.5, "$2M-$10M": 2.0, "$10M-$50M": 3.0, "$50M-$200M": 4.2, "$200M+": 5.0 },
  },
  wageToRevenueRatio: {
    // T3+ only (inverted scale)
    3: { "<40%": 5.0, "40-55%": 4.0, "55-65%": 3.0, "65-75%": 2.0, ">75%": 1.0 },
    4: { "<40%": 4.5, "40-55%": 4.2, "55-65%": 3.8, "65-75%": 2.5, ">75%": 1.2 },
    5: { "<40%": 3.8, "40-55%": 4.5, "55-65%": 4.8, "65-75%": 3.5, ">75%": 1.5 },
  },
  netPromoterScore: {
    3: { "Don't measure": 1.5, "<20": 2.0, "20-40": 3.0, "40-60": 4.0, "60+": 5.0 },
    // T4 and T5 use the flat mapping (Don't measure = 1.0)
  },
};

// ─── DIMENSION → QUESTION IDS MAPPING ────────────────────────────────────────
const DIMENSION_QUESTIONS: Record<string, string[]> = {
  fan: [
    "socialFollowers", "attendanceCapacity", "fanDatabase",
    "activeMembersCount", "fanCommunicationFreq", "communityEventCount",
    "seasonTicketRenewal", "matchdayExperience", "socialMediaActivePlatforms",
    "netPromoterScore", "fanDatabaseCoveragePercent", "averageRevenuePerFan", "fanSegmentation",
    "fanLifetimeValue", "loyaltyProgram", "fanDataInfrastructure",
    // T5-exclusive
    "globalFanResearch",
  ],
  commercial: [
    "sponsorCount", "sponsorRevenueShare", "digitalMonetization",
    "averageSponsorDealLength", "merchandiseRevenue",
    "hospitalityRevenue", "sponsorActivation",
    "commercialRevenuePerSeat", "sponsorSatisfaction", "unfilledSponsorCategories", "digitalInventoryValue", "revenueConcentration",
    "brandValuation", "commercialInnovation", "internationalCommercialRevenue",
    // T5-exclusive
    "multiClubOwnership", "esgReportingMaturity", "digitalProductRevenue", "playerIpCommerc",
  ],
  talent: [
    "playerAttraction", "academyPathway",
    "coachingCertifications", "playerRetentionRate", "volunteerCoachRatio",
    "scoutingNetwork", "staffDevelopmentBudget",
    "academyToFirstTeam", "performanceTechUsage", "internationalScoutingReach", "wageToRevenueRatio",
    "talentDataInfrastructure", "playerDevelopmentTracking",
    // T5-exclusive
    "talentBrandGlobal",
  ],
  media: [
    "contentOutput", "mediaCoverage",
    "dedicatedContentPerson", "localMediaPartnerships", "communityStorytellingEvents",
    "websiteTraffic", "contentPlatforms",
    "contentProductionCadence", "brandArchitecture", "estimatedMediaValue", "broadcastingReach",
    "documentaryPresence", "culturalTranscendence", "earnedMediaValue",
    // T5-exclusive
    "globalMediaRightsStrat",
  ],
  competitive: [
    "leaguePositionTrend", "performanceAnalytics",
    "competitiveGoalAlignment", "trophiesRecentYears",
    "continentalCompetition", "performanceDepartmentSize",
    "peerBenchmarking", "dataDecisionMaking", "budgetPerformanceEfficiency",
    "globalCompetitivePosition", "performanceInnovation",
    // T5-exclusive
    "innovationDepartment",
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Revenue range to tier mapping
function getTier(revenue: string): { tier: number; label: string } {
  switch (revenue) {
    case "Under $3M":
      return { tier: 1, label: "Grassroots" };
    case "$3M-$10M":
      return { tier: 2, label: "Foundation" };
    case "$10M-$50M":
      return { tier: 3, label: "Challenger" };
    case "$50M-$300M":
      return { tier: 4, label: "Contender" };
    case "Over $300M":
      return { tier: 5, label: "Elite" };
    default:
      return { tier: 3, label: "Challenger" };
  }
}

function getScore(questionId: string, answer: string, tier: number = 3): number {
  // Check tier-specific scores first
  const tierMapping = TIER_ANSWER_SCORES[questionId];
  if (tierMapping && tierMapping[tier]) {
    return tierMapping[tier][answer] ?? 2.5;
  }
  // Fall back to flat scores
  const mapping = ANSWER_SCORES[questionId];
  if (!mapping) return 2.5;
  return mapping[answer] ?? 2.5;
}

/**
 * Calculate the average score for a dimension based on all answered questions.
 * Only questions that have answers contribute to the average.
 */
function getDimensionAchieved(dimKey: string, answers: Record<string, string>, tier: number): number {
  const questionIds = DIMENSION_QUESTIONS[dimKey] || [];
  const scores: number[] = [];
  for (const qId of questionIds) {
    const answer = answers[qId];
    if (answer && answer.trim() !== "") {
      scores.push(getScore(qId, answer, tier));
    }
  }
  if (scores.length === 0) return 2.5; // default if no answers
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// Catchment population to numeric midpoint (for scaling)
function getCatchmentSize(catchment: string): number {
  switch (catchment) {
    case "<10K": return 5000;
    case "10K-50K": return 30000;
    case "50K-150K": return 100000;
    case "150K-500K": return 300000;
    case "500K-1M": return 750000;
    case "1M+": return 1500000;
    default: return 100000;
  }
}

// Catchment multiplier on potential ceiling for catchment-sensitive dimensions (Fan, Commercial, Media)
// This scales the addressable ceiling based on local population, but its influence
// decreases as tier increases (higher tiers have national/international reach)
function getCatchmentMultiplier(catchment: string, tier: number, internationalReach: string): number {
  const pop = getCatchmentSize(catchment);

  // Base catchment factor: 0.5 (tiny village) to 1.0 (major metro)
  // Logarithmic scale — doubling population doesn't double potential
  const baseFactor = Math.min(1.0, 0.4 + 0.1 * Math.log10(pop / 1000));

  // How much does catchment matter at this tier?
  // T1: 90%, T2: 70%, T3: 50%, T4: 30%, T5: 10%
  const catchmentWeight: Record<number, number> = {
    1: 0.90,
    2: 0.70,
    3: 0.50,
    4: 0.30,
    5: 0.10,
  };
  const weight = catchmentWeight[tier] ?? 0.50;

  // Audience reach multiplier for T3+ (compensates for small catchment)
  let reachBonus = 1.0;
  if (tier >= 3) {
    if (internationalReach === "international") {
      reachBonus = 1.15; // International brand transcends city size
    } else if (internationalReach === "national") {
      reachBonus = 1.08; // National presence partially compensates
    }
    // "local" or not answered = no bonus
  }

  // Final multiplier: blend catchment factor with tier-based floor
  // At T1: almost entirely driven by catchment (baseFactor)
  // At T5: almost entirely floor of 1.0 (catchment barely matters)
  const multiplier = (baseFactor * weight) + (1.0 * (1 - weight));

  return Math.min(multiplier * reachBonus, 1.2); // cap at 1.2 to prevent inflated ceilings
}

interface PotentialParams {
  achieved: number;
  tier: number;
  hasCapabilityBoost: boolean;
  /** Only Fan, Commercial, Media are catchment-sensitive */
  catchmentSensitive: boolean;
  catchmentMultiplier: number;
}

function calcPotential(params: PotentialParams): number {
  const { achieved, tier, hasCapabilityBoost, catchmentSensitive, catchmentMultiplier } = params;

  const tierCeilings: Record<number, { maxUplift: number; ceiling: number }> = {
    1: { maxUplift: 1.2, ceiling: 3.5 },
    2: { maxUplift: 1.0, ceiling: 4.0 },
    3: { maxUplift: 0.8, ceiling: 4.3 },
    4: { maxUplift: 0.6, ceiling: 4.6 },
    5: { maxUplift: 0.4, ceiling: 4.8 },
  };

  const config = tierCeilings[tier] || tierCeilings[3];
  let uplift = config.maxUplift;
  if (hasCapabilityBoost) {
    uplift += 0.2;
  }

  let ceiling = config.ceiling;
  if (catchmentSensitive) {
    // Adjust ceiling based on catchment — a T1 village club can't reach the same
    // ceiling as a T1 city club, but the effect fades at higher tiers
    ceiling = ceiling * catchmentMultiplier;
  }

  return Math.min(achieved + uplift, ceiling);
}

function getRatingBand(score: number): string {
  if (score >= 4.5) return "Elite Attractor";
  if (score >= 3.5) return "Strong Attractor";
  if (score >= 2.5) return "Moderate Attractor";
  if (score >= 1.5) return "Developing Attractor";
  return "Low Attractor";
}

function getInitiatives(dimensions: ScasScores["dimensions"], tier: number): Initiative[] {
  const allInitiatives: Initiative[] = [];

  const gaps = [
    { key: "fan", dim: dimensions.fan, label: "Fan Attraction" },
    { key: "commercial", dim: dimensions.commercial, label: "Commercial Attraction" },
    { key: "talent", dim: dimensions.talent, label: "Talent Attraction" },
    { key: "media", dim: dimensions.media, label: "Media & Cultural Attraction" },
    { key: "competitive", dim: dimensions.competitive, label: "Competitive Attraction" },
  ].sort((a, b) => b.dim.uplift - a.dim.uplift);

  for (const gap of gaps) {
    if (gap.key === "fan" && gap.dim.uplift > 0.5) {
      allInitiatives.push({
        name: "Fan Engagement Platform",
        dimension: gap.label,
        impactRange: "+0.3 to +0.6",
        timeline: "6-12 months",
        effort: "Medium",
        reason: `Your fan dimension has ${gap.dim.uplift.toFixed(1)} points of untapped potential. A structured engagement platform can systematically close this gap by improving communication frequency, database coverage, and fan segmentation.`,
      });
      allInitiatives.push({
        name: "Community & Grassroots Program",
        dimension: gap.label,
        impactRange: "+0.1 to +0.3",
        timeline: "3-12 months",
        effort: "Low-Medium",
        reason: `Community events and grassroots programmes build organic fan loyalty and grow your active member base — two areas where your current scores indicate room for improvement.`,
      });
      // Social Media Professionalization archetype
      if (gap.dim.achieved < 3.0) {
        allInitiatives.push({
          name: "Social Media Professionalization",
          dimension: gap.label,
          impactRange: "+0.2 to +0.5",
          timeline: "3-6 months",
          effort: "Medium",
          reason: `Your fan achieved score (${gap.dim.achieved.toFixed(1)}) suggests social media presence and follower growth have significant room for improvement, which directly affects fan reach and engagement.`,
        });
      }
    }
    if (gap.key === "commercial" && gap.dim.uplift > 0.5) {
      allInitiatives.push({
        name: "Commercial Strategy Overhaul",
        dimension: gap.label,
        impactRange: "+0.4 to +0.8",
        timeline: "6-18 months",
        effort: "High",
        reason: `Your commercial dimension shows ${gap.dim.uplift.toFixed(1)} points of uplift potential. Restructuring your sponsorship portfolio, pricing strategy, and revenue diversification can unlock significant value.`,
      });
      allInitiatives.push({
        name: "Sponsorship Activation Upgrade",
        dimension: gap.label,
        impactRange: "+0.2 to +0.4",
        timeline: "3-6 months",
        effort: "Medium",
        reason: `Moving beyond passive logo placement to strategic co-creation and multi-channel activation improves sponsor satisfaction, retention, and deal values.`,
      });
    }
    if (gap.key === "talent" && gap.dim.uplift > 0.4) {
      allInitiatives.push({
        name: "Academy Restructuring",
        dimension: gap.label,
        impactRange: "+0.3 to +0.6",
        timeline: "12-24 months",
        effort: "High",
        reason: `Your talent dimension has ${gap.dim.uplift.toFixed(1)} points of uplift. Formalising academy pathways, coaching certification, and player development tracking directly improves talent attraction and retention.`,
      });
    }
    if (gap.key === "media" && gap.dim.uplift > 0.5) {
      allInitiatives.push({
        name: "Content Production Engine",
        dimension: gap.label,
        impactRange: "+0.3 to +0.6",
        timeline: "3-9 months",
        effort: "Medium",
        reason: `Your media dimension has ${gap.dim.uplift.toFixed(1)} points of untapped potential. Professionalising content output and cadence across platforms is the fastest lever to improve media visibility and cultural relevance.`,
      });
      allInitiatives.push({
        name: "Brand & Identity Refresh",
        dimension: gap.label,
        impactRange: "+0.2 to +0.5",
        timeline: "6-12 months",
        effort: "Medium-High",
        reason: `A cohesive brand architecture and identity system strengthens media perception, making every piece of content and partnership more impactful.`,
      });
    }
    if (gap.key === "competitive" && gap.dim.uplift > 0.3) {
      allInitiatives.push({
        name: "Performance Analytics Suite",
        dimension: gap.label,
        impactRange: "+0.2 to +0.4",
        timeline: "6-12 months",
        effort: "Medium",
        reason: `Your competitive dimension has ${gap.dim.uplift.toFixed(1)} points of uplift. Investing in performance analytics and data-driven decision-making improves on-field competitiveness relative to resources.`,
      });
    }
  }

  // Additional cross-dimensional archetypes from methodology
  // Stadium Enhancement — if fan attendance is low and tier >= 2
  if (dimensions.fan.achieved < 3.0 && tier >= 2) {
    allInitiatives.push({
      name: "Stadium Experience Enhancement",
      dimension: "Fan Attraction",
      impactRange: "+0.2 to +0.5",
      timeline: "6-18 months",
      effort: "High",
      reason: `Your overall fan score (${dimensions.fan.achieved.toFixed(1)}) indicates the matchday experience and venue engagement have room for improvement, which directly affects attendance, season ticket renewal, and per-fan revenue.`,
    });
  }

  // Data Infrastructure Modernization — if multiple data-related scores are low
  if (dimensions.fan.achieved < 3.0 && dimensions.commercial.achieved < 3.0 && tier >= 3) {
    allInitiatives.push({
      name: "Data Infrastructure Modernization",
      dimension: "Cross-Dimensional",
      impactRange: "+0.3 to +0.6",
      timeline: "12-24 months",
      effort: "High",
      reason: `Both your fan (${dimensions.fan.achieved.toFixed(1)}) and commercial (${dimensions.commercial.achieved.toFixed(1)}) scores are below 3.0, suggesting fragmented data capabilities are limiting fan segmentation, sponsor analytics, and revenue optimisation across multiple dimensions.`,
    });
  }

  // International Expansion — for T3+ with national/international potential
  if (tier >= 3 && dimensions.commercial.achieved >= 3.0 && dimensions.fan.achieved >= 3.0) {
    allInitiatives.push({
      name: "International Expansion Strategy",
      dimension: "Commercial Attraction",
      impactRange: "+0.2 to +0.5",
      timeline: "12-36 months",
      effort: "Very High",
      reason: `As a T${tier}+ club with solid fan (${dimensions.fan.achieved.toFixed(1)}) and commercial (${dimensions.commercial.achieved.toFixed(1)}) foundations, you're positioned to capture international revenue and fanbase growth that could significantly expand your addressable potential.`,
    });
  }

  // Return top initiatives sorted by impact
  return allInitiatives.slice(0, 5);
}

// ─── QUESTION LABELS (for Score Driver Attribution) ───────────────────────
const QUESTION_LABELS: Record<string, string> = {
  // Fan
  socialFollowers: "Total Social Media Followers",
  attendanceCapacity: "Matchday Attendance vs Capacity",
  fanDatabase: "Fan Database Maturity",
  activeMembersCount: "Active Members Count",
  fanCommunicationFreq: "Fan Communication Frequency",
  communityEventCount: "Community Events Per Year",
  seasonTicketRenewal: "Season Ticket Renewal Rate",
  matchdayExperience: "Matchday Experience Quality",
  socialMediaActivePlatforms: "Active Social Media Platforms",
  netPromoterScore: "Net Promoter Score",
  fanDatabaseCoveragePercent: "Fan Database Coverage %",
  averageRevenuePerFan: "Average Revenue Per Fan",
  fanSegmentation: "Fan Segmentation Depth",
  fanLifetimeValue: "Fan Lifetime Value Tracking",
  loyaltyProgram: "Loyalty Program",
  fanDataInfrastructure: "Fan Data Infrastructure",
  globalFanResearch: "Global Fan Research",
  // Commercial
  sponsorCount: "Number of Sponsors",
  sponsorRevenueShare: "Sponsorship Revenue Share",
  digitalMonetization: "Digital Monetization Maturity",
  averageSponsorDealLength: "Average Sponsor Deal Length",
  merchandiseRevenue: "Merchandise Revenue Maturity",
  hospitalityRevenue: "Hospitality Revenue",
  sponsorActivation: "Sponsor Activation Quality",
  commercialRevenuePerSeat: "Commercial Revenue Per Seat",
  sponsorSatisfaction: "Sponsor Satisfaction",
  unfilledSponsorCategories: "Unfilled Sponsor Categories",
  digitalInventoryValue: "Digital Inventory Value",
  revenueConcentration: "Revenue Concentration Risk",
  brandValuation: "Brand Valuation",
  commercialInnovation: "Commercial Innovation",
  internationalCommercialRevenue: "International Commercial Revenue",
  multiClubOwnership: "Multi-Club Ownership Synergy",
  esgReportingMaturity: "ESG Reporting Maturity",
  digitalProductRevenue: "Digital Product Revenue",
  playerIpCommerc: "Player IP Commercialisation",
  // Talent
  playerAttraction: "Player Attraction Capability",
  academyPathway: "Academy Pathway",
  coachingCertifications: "Coaching Certifications",
  playerRetentionRate: "Player Retention Rate",
  volunteerCoachRatio: "Volunteer Coach Ratio",
  scoutingNetwork: "Scouting Network",
  staffDevelopmentBudget: "Staff Development Budget",
  academyToFirstTeam: "Academy to First Team Rate",
  performanceTechUsage: "Performance Technology Usage",
  internationalScoutingReach: "International Scouting Reach",
  wageToRevenueRatio: "Wage to Revenue Ratio",
  talentDataInfrastructure: "Talent Data Infrastructure",
  playerDevelopmentTracking: "Player Development Tracking",
  talentBrandGlobal: "Global Talent Brand",
  // Media
  contentOutput: "Content Output Volume",
  mediaCoverage: "Media Coverage Level",
  dedicatedContentPerson: "Dedicated Content Person",
  localMediaPartnerships: "Local Media Partnerships",
  communityStorytellingEvents: "Community Storytelling Events",
  websiteTraffic: "Website Traffic",
  contentPlatforms: "Content Platforms Used",
  contentProductionCadence: "Content Production Cadence",
  brandArchitecture: "Brand Architecture",
  estimatedMediaValue: "Estimated Media Value",
  broadcastingReach: "Broadcasting Reach",
  documentaryPresence: "Documentary Presence",
  culturalTranscendence: "Cultural Transcendence",
  earnedMediaValue: "Earned Media Value Tracking",
  globalMediaRightsStrat: "Global Media Rights Strategy",
  // Competitive
  leaguePositionTrend: "League Position Trend",
  performanceAnalytics: "Performance Analytics",
  competitiveGoalAlignment: "Competitive Goal Alignment",
  trophiesRecentYears: "Trophies in Recent Years",
  continentalCompetition: "Continental Competition",
  performanceDepartmentSize: "Performance Department Size",
  peerBenchmarking: "Peer Benchmarking",
  dataDecisionMaking: "Data-Driven Decision Making",
  budgetPerformanceEfficiency: "Budget Performance Efficiency",
  globalCompetitivePosition: "Global Competitive Position",
  performanceInnovation: "Performance Innovation",
  innovationDepartment: "Innovation Department",
};

// ─── IMPLICATION TEMPLATES ────────────────────────────────────────────────
function getImplication(signal: "boosting" | "neutral" | "dragging", questionId: string): string {
  const label = QUESTION_LABELS[questionId] || questionId;
  if (signal === "boosting") return `Strong performance in ${label.toLowerCase()} is elevating your score in this dimension.`;
  if (signal === "dragging") return `Improving ${label.toLowerCase()} would have a meaningful positive impact on this dimension.`;
  return `${label} is performing in line with your other areas in this dimension.`;
}

// ─── SCORE DRIVER COMPUTATION ─────────────────────────────────────────────
function computeScoreDrivers(
  answers: Record<string, string>,
  tier: number
): Record<string, DimensionDrivers> {
  const result: Record<string, DimensionDrivers> = {};

  for (const [dimKey, questionIds] of Object.entries(DIMENSION_QUESTIONS)) {
    // Collect scores for answered questions
    const answeredScores: { qId: string; answer: string; score: number }[] = [];
    for (const qId of questionIds) {
      const answer = answers[qId];
      if (answer && answer.trim() !== "") {
        answeredScores.push({ qId, answer, score: getScore(qId, answer, tier) });
      }
    }

    if (answeredScores.length === 0) {
      result[dimKey] = { entries: [], summary: "No questions answered in this dimension." };
      continue;
    }

    // Calculate dimension mean
    const dimMean = answeredScores.reduce((sum, s) => sum + s.score, 0) / answeredScores.length;

    // Classify each question
    const entries: ScoreDriverEntry[] = answeredScores.map(({ qId, answer, score }) => {
      let signal: "boosting" | "neutral" | "dragging";
      if (score >= dimMean + 0.5) {
        signal = "boosting";
      } else if (score <= dimMean - 0.5) {
        signal = "dragging";
      } else {
        signal = "neutral";
      }
      return {
        questionId: qId,
        questionLabel: QUESTION_LABELS[qId] || qId,
        answer,
        score,
        signal,
        implication: getImplication(signal, qId),
      };
    });

    // Sort: dragging first, then neutral, then boosting (most actionable first)
    entries.sort((a, b) => {
      const order = { dragging: 0, neutral: 1, boosting: 2 };
      return order[a.signal] - order[b.signal];
    });

    // Generate dimension summary
    const boosting = entries.filter(e => e.signal === "boosting");
    const dragging = entries.filter(e => e.signal === "dragging");

    let summary = "";
    if (boosting.length > 0 && dragging.length > 0) {
      const topStr = boosting.slice(0, 2).map(e => e.questionLabel.toLowerCase()).join(" and ");
      const bottomStr = dragging.slice(0, 2).map(e => e.questionLabel.toLowerCase()).join(" and ");
      summary = `Your strongest areas are ${topStr}. The most significant growth opportunities lie in ${bottomStr}.`;
    } else if (boosting.length > 0) {
      const topStr = boosting.slice(0, 2).map(e => e.questionLabel.toLowerCase()).join(" and ");
      summary = `Strong, balanced performance across this dimension, led by ${topStr}.`;
    } else if (dragging.length > 0) {
      const bottomStr = dragging.slice(0, 2).map(e => e.questionLabel.toLowerCase()).join(" and ");
      summary = `This dimension has room for improvement, particularly in ${bottomStr}.`;
    } else {
      summary = "Balanced performance across all areas of this dimension.";
    }

    result[dimKey] = { entries, summary };
  }

  return result;
}

export function calculateScores(answers: Record<string, string>, revenue: string): ScasScores {
  const { tier, label: tierLabel } = getTier(revenue);

  // Catchment context
  const catchment = answers.catchmentPopulation || "50K-150K"; // default mid-size if missing
  const internationalReach = answers.internationalReach || "local";
  const catchMult = getCatchmentMultiplier(catchment, tier, internationalReach);

  // Calculate per-dimension achieved scores (averages all answered questions)
  const fanAchieved = getDimensionAchieved("fan", answers, tier);
  const commercialAchieved = getDimensionAchieved("commercial", answers, tier);
  const talentAchieved = getDimensionAchieved("talent", answers, tier);
  const mediaAchieved = getDimensionAchieved("media", answers, tier);
  const competitiveAchieved = getDimensionAchieved("competitive", answers, tier);

  // Capability Readiness Factor (CRF):
  // If average dimension score >= 3.5, the club has capability to boost potential
  const dimScores = [fanAchieved, commercialAchieved, talentAchieved, mediaAchieved, competitiveAchieved];
  const avgAllDims = dimScores.reduce((a, b) => a + b, 0) / dimScores.length;

  const fanHasBoost = avgAllDims >= 3.5 || fanAchieved >= 3.5;
  const commercialHasBoost = avgAllDims >= 3.5 || commercialAchieved >= 3.5;
  const talentHasBoost = avgAllDims >= 3.5 || talentAchieved >= 3.5;
  const mediaHasBoost = avgAllDims >= 3.5 || mediaAchieved >= 3.5;
  const competitiveHasBoost = avgAllDims >= 3.5 || competitiveAchieved >= 3.5;

  // Build dimension scores — Fan, Commercial, Media are catchment-sensitive;
  // Talent and Competitive are not (driven by budget/league structure)
  const buildDim = (achieved: number, weight: number, hasBoost: boolean, catchmentSensitive: boolean): DimensionScore => {
    const a = Math.round(achieved * 10) / 10;
    const p = Math.round(calcPotential({
      achieved,
      tier,
      hasCapabilityBoost: hasBoost,
      catchmentSensitive,
      catchmentMultiplier: catchMult,
    }) * 10) / 10;
    return {
      achieved: a,
      potential: p,
      uplift: Math.round((p - a) * 10) / 10,
      conversionRate: Math.round((a / p) * 100),
      weight,
    };
  };

  const dimensions = {
    fan: buildDim(fanAchieved, 0.30, fanHasBoost, true),
    commercial: buildDim(commercialAchieved, 0.25, commercialHasBoost, true),
    talent: buildDim(talentAchieved, 0.15, talentHasBoost, false),
    media: buildDim(mediaAchieved, 0.15, mediaHasBoost, true),
    competitive: buildDim(competitiveAchieved, 0.15, competitiveHasBoost, false),
  };

  // Overall weighted scores
  const overallAchieved =
    dimensions.fan.achieved * 0.30 +
    dimensions.commercial.achieved * 0.25 +
    dimensions.talent.achieved * 0.15 +
    dimensions.media.achieved * 0.15 +
    dimensions.competitive.achieved * 0.15;

  const overallPotential =
    dimensions.fan.potential * 0.30 +
    dimensions.commercial.potential * 0.25 +
    dimensions.talent.potential * 0.15 +
    dimensions.media.potential * 0.15 +
    dimensions.competitive.potential * 0.15;

  const oA = Math.round(overallAchieved * 100) / 100;
  const oP = Math.round(overallPotential * 100) / 100;

  // Find biggest opportunity
  const dimEntries = Object.entries(dimensions) as [string, DimensionScore][];
  const biggest = dimEntries.reduce((max, [key, dim]) =>
    dim.uplift > max[1].uplift ? [key, dim] : max
  );
  const dimLabels: Record<string, string> = {
    fan: "Fan Attraction",
    commercial: "Commercial Attraction",
    talent: "Talent Attraction",
    media: "Media & Cultural Attraction",
    competitive: "Competitive Attraction",
  };

  return {
    tier,
    tierLabel,
    catchmentContext: {
      population: catchment,
      internationalReach,
      catchmentMultiplier: Math.round(catchMult * 100) / 100,
    },
    dimensions,
    overall: {
      achieved: oA,
      potential: oP,
      uplift: Math.round((oP - oA) * 100) / 100,
      conversionRate: Math.round((oA / oP) * 100),
    },
    ratingBand: getRatingBand(oA),
    biggestOpportunity: dimLabels[biggest[0]],
    initiatives: getInitiatives(dimensions, tier),
    scoreDrivers: computeScoreDrivers(answers, tier),
  };
}
