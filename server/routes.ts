import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assessmentSubmitSchema, unlockSchema, premiumLeadSchema } from "@shared/schema";
import { calculateScores } from "./scoring";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Create a new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const parsed = assessmentSubmitSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { clubName, sport, country, league, annualRevenue, answers, mode } = parsed.data;

      // Calculate scores
      const scores = calculateScores(answers, annualRevenue);

      // Determine tier from revenue
      const tier = scores.tier;

      // Generate voucher code for premium assessments
      const voucherCode = mode === "premium" 
        ? `SCAS-${Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))).join('')}`
        : null;

      // For premium assessments, auto-attach lead data from the premium gate
      let leadEmail: string | null = null;
      let leadName: string | null = null;
      let leadRole: string | null = null;
      if (mode === "premium") {
        const lead = await storage.getLatestPremiumLead();
        if (lead) {
          leadEmail = lead.email;
          leadName = lead.name;
          leadRole = lead.role;
        }
      }

      const assessment = await storage.createAssessment({
        clubName,
        sport,
        country,
        league: league || null,
        tier,
        annualRevenue,
        answers: JSON.stringify(answers),
        scores: JSON.stringify(scores),
        email: leadEmail,
        contactName: leadName,
        orgRole: leadRole,
        mode: mode || "free",
        voucherCode,
        completedAt: new Date().toISOString(),
      });

      return res.json({ id: assessment.id, scores });
    } catch (err: any) {
      console.error("Error creating assessment:", err);
      return res.status(500).json({ error: "Failed to create assessment" });
    }
  });

  // Tier price lookup
  const TIER_PRICES: Record<number, number> = { 1: 19, 2: 49, 3: 99, 4: 159, 5: 490 };

  // Get assessment by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(req.params.id);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      return res.json({
        ...assessment,
        answers: JSON.parse(assessment.answers),
        scores: JSON.parse(assessment.scores),
        unlocked: !!assessment.email,
        mode: assessment.mode || "free",
        voucherCode: assessment.voucherCode || null,
        tierPrice: TIER_PRICES[assessment.tier] || 49,
        leadEmail: assessment.email || null,
        leadName: assessment.contactName || null,
        leadRole: assessment.orgRole || null,
      });
    } catch (err: any) {
      console.error("Error fetching assessment:", err);
      return res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });

  // Unlock premium results
  app.post("/api/assessments/:id/unlock", async (req, res) => {
    try {
      const parsed = unlockSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { email, contactName, orgRole } = parsed.data;
      const updated = await storage.updateAssessmentLead(
        req.params.id,
        email,
        contactName,
        orgRole
      );

      if (!updated) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error("Error unlocking assessment:", err);
      return res.status(500).json({ error: "Failed to unlock assessment" });
    }
  });

  // Create premium lead
  app.post("/api/premium-leads", async (req, res) => {
    try {
      const parsed = premiumLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const lead = await storage.createPremiumLead(parsed.data);
      return res.json({ success: true, id: lead.id });
    } catch (err: any) {
      console.error("Error creating premium lead:", err);
      return res.status(500).json({ error: "Failed to create premium lead" });
    }
  });

  return httpServer;
}
