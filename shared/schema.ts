import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubName: text("club_name").notNull(),
  sport: text("sport").notNull(),
  country: text("country").notNull(),
  league: text("league"),
  tier: integer("tier").notNull(),
  annualRevenue: text("annual_revenue").notNull(),
  answers: text("answers").notNull(), // JSON string
  scores: text("scores").notNull(), // JSON string
  email: text("email"),
  contactName: text("contact_name"),
  orgRole: text("org_role"),
  mode: text("mode").default("free"),
  voucherCode: text("voucher_code"),
  completedAt: text("completed_at").notNull(),
});

export const premiumLeads = pgTable("premium_leads", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull(),
  role: text("role").notNull(),
  selectedTier: integer("selected_tier"),
  createdAt: text("created_at").notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Unlock schema for lead capture
export const unlockSchema = z.object({
  email: z.string().email(),
  contactName: z.string().min(1),
  orgRole: z.string().min(1),
});

export type UnlockData = z.infer<typeof unlockSchema>;

// Assessment submission schema
export const assessmentSubmitSchema = z.object({
  clubName: z.string().min(1),
  sport: z.string().min(1),
  country: z.string().min(1),
  league: z.string().optional(),
  annualRevenue: z.string().min(1),
  answers: z.record(z.string(), z.string()),
  mode: z.enum(["free", "premium"]).optional().default("free"),
});

export type AssessmentSubmit = z.infer<typeof assessmentSubmitSchema>;

// Premium lead submission schema
export const premiumLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().min(1),
  role: z.string().min(1),
  selectedTier: z.number().min(1).max(5).optional(),
});

export type PremiumLead = typeof premiumLeads.$inferSelect;
export type InsertPremiumLead = z.infer<typeof premiumLeadSchema>;

// Score types
export interface DimensionScore {
  achieved: number;
  potential: number;
  uplift: number;
  conversionRate: number;
  weight: number;
}

export interface ScasScores {
  tier: number;
  tierLabel: string;
  catchmentContext: {
    population: string;
    internationalReach: string;
    catchmentMultiplier: number;
    // v2.4 virtual catchment signals
    digitalReachRatio: string | null;
    marketCompetition: string | null;
    sportMarketFit: string | null;
  };
  dimensions: {
    fan: DimensionScore;
    commercial: DimensionScore;
    talent: DimensionScore;
    media: DimensionScore;
    competitive: DimensionScore;
  };
  overall: {
    achieved: number;
    potential: number;
    uplift: number;
    conversionRate: number;
  };
  ratingBand: string;
  biggestOpportunity: string;
  initiatives: Initiative[];
  scoreDrivers?: Record<string, DimensionDrivers>;
  potentialDrivers?: Record<string, DimensionPotentialDrivers>;
}

export interface Initiative {
  name: string;
  dimension: string;
  impactRange: string;
  timeline: string;
  effort: string;
  reason: string;
}

export interface ScoreDriverEntry {
  questionId: string;
  questionLabel: string;
  answer: string;
  score: number;
  signal: "boosting" | "neutral" | "dragging";
  implication: string;
}

export interface DimensionDrivers {
  entries: ScoreDriverEntry[];
  summary: string;
}

// ─── Potential Drivers (ceiling transparency) ──────────────────────────────
export interface PotentialDriverEntry {
  factor: "tier" | "headroom" | "catchment" | "capability";
  label: string;
  signal: "boosting" | "neutral" | "dragging" | "info" | "na";
  text: string;
}

export interface DimensionPotentialDrivers {
  entries: PotentialDriverEntry[];
  summary: string;
}
