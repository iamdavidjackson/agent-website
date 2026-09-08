import { z } from "zod";

export const applicationInputSchema = z.object({
  company: z.string().trim().min(2).max(160),
  jobTitle: z.string().trim().min(2).max(200),
  jobUrl: z.string().trim().url().or(z.literal("")).optional(),
  recruiterName: z.string().trim().max(160).optional(),
  jobDescription: z.string().trim().min(100).max(60_000),
  notes: z.string().trim().max(10_000).optional(),
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;

export type JobAnalysis = {
  roleSummary: string;
  seniority: string;
  requirements: Array<{
    requirement: string;
    priority: "required" | "preferred" | "inferred";
    category: "technical" | "leadership" | "product" | "industry" | "other";
  }>;
  keywords: string[];
  ambiguities: string[];
};

export type ApplicationBrief = {
  executiveSummary: string;
  recommendation: "strong-apply" | "apply" | "conditional" | "low-fit";
  fitAssessment: Array<{
    dimension: string;
    rating: "strong" | "moderate" | "limited" | "unknown";
    rationale: string;
  }>;
  evidenceMatches: Array<{
    requirement: string;
    strength: "strong" | "moderate" | "weak" | "none";
    evidenceIds: string[];
    rationale: string;
  }>;
  gaps: Array<{
    area: string;
    type: "experience-gap" | "knowledge-gap" | "missing-evidence";
    action: string;
  }>;
  researchAndImprovement: string[];
  positioning: string[];
  resumeFocus: string[];
  interviewThemes: string[];
};

export type ApprovalPayload = {
  approved: boolean;
  notes?: string;
};

export type GeneratedDocuments = {
  resumeMarkdown: string;
  coverLetterMarkdown: string;
  interviewPrepMarkdown: string;
  validationNotes: string[];
};

export type ApplicationRow = {
  id: string;
  company: string;
  job_title: string;
  job_url: string | null;
  recruiter_name: string | null;
  job_description: string;
  notes: string | null;
  status: string;
  stage: string;
  workflow_id: string;
  error: string | null;
  created_at: string;
  updated_at: string;
};

export type ArtifactRow = {
  id: string;
  application_id: string;
  kind: string;
  format: string;
  r2_key: string;
  created_at: string;
};
