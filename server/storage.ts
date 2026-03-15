import { type Assessment, type InsertAssessment, type PremiumLead } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  updateAssessmentLead(id: string, email: string, contactName: string, orgRole: string): Promise<Assessment | undefined>;
  getAllAssessments(): Promise<Assessment[]>;
  createPremiumLead(lead: { name: string; email: string; organization: string; role: string; selectedTier?: number }): Promise<PremiumLead>;
}

export class MemStorage implements IStorage {
  private assessments: Map<string, Assessment>;
  private premiumLeads: PremiumLead[];
  private leadIdCounter: number;

  constructor() {
    this.assessments = new Map();
    this.premiumLeads = [];
    this.leadIdCounter = 1;
  }

  async createAssessment(insert: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const assessment: Assessment = {
      id,
      clubName: insert.clubName,
      sport: insert.sport,
      country: insert.country,
      league: insert.league ?? null,
      tier: insert.tier,
      annualRevenue: insert.annualRevenue,
      answers: insert.answers,
      scores: insert.scores,
      email: insert.email ?? null,
      contactName: insert.contactName ?? null,
      orgRole: insert.orgRole ?? null,
      mode: insert.mode ?? "free",
      voucherCode: insert.voucherCode ?? null,
      completedAt: insert.completedAt,
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async updateAssessmentLead(id: string, email: string, contactName: string, orgRole: string): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;
    const updated = { ...assessment, email, contactName, orgRole };
    this.assessments.set(id, updated);
    return updated;
  }

  async getAllAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  async createPremiumLead(lead: { name: string; email: string; organization: string; role: string; selectedTier?: number }): Promise<PremiumLead> {
    const premiumLead: PremiumLead = {
      id: this.leadIdCounter++,
      name: lead.name,
      email: lead.email,
      organization: lead.organization,
      role: lead.role,
      selectedTier: lead.selectedTier ?? null,
      createdAt: new Date().toISOString(),
    };
    this.premiumLeads.push(premiumLead);
    return premiumLead;
  }
}

export const storage = new MemStorage();
