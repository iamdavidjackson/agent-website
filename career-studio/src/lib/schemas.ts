export const jobAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleSummary: { type: "string" },
    seniority: { type: "string" },
    requirements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          requirement: { type: "string" },
          priority: { type: "string", enum: ["required", "preferred", "inferred"] },
          category: {
            type: "string",
            enum: ["technical", "leadership", "product", "industry", "other"],
          },
        },
        required: ["requirement", "priority", "category"],
      },
    },
    keywords: { type: "array", items: { type: "string" } },
    ambiguities: { type: "array", items: { type: "string" } },
  },
  required: ["roleSummary", "seniority", "requirements", "keywords", "ambiguities"],
} as const;

export const researchRootPlanSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roots: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          url: { type: "string" },
          reason: { type: "string" },
        },
        required: ["url", "reason"],
      },
    },
  },
  required: ["roots"],
} as const;

export const researchSourcePlanSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          url: { type: "string" },
          title: { type: "string" },
          category: {
            type: "string",
            enum: ["company-product", "culture-practices", "role-context"],
          },
          reason: { type: "string" },
        },
        required: ["url", "title", "category", "reason"],
      },
    },
  },
  required: ["sources"],
} as const;

export const applicationBriefSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    executiveSummary: { type: "string" },
    recommendation: {
      type: "string",
      enum: ["strong-apply", "apply", "conditional", "low-fit"],
    },
    fitAssessment: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          dimension: { type: "string" },
          rating: { type: "string", enum: ["strong", "moderate", "limited", "unknown"] },
          rationale: { type: "string" },
        },
        required: ["dimension", "rating", "rationale"],
      },
    },
    evidenceMatches: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          requirement: { type: "string" },
          strength: { type: "string", enum: ["strong", "moderate", "weak", "none"] },
          evidenceIds: { type: "array", items: { type: "string" } },
          rationale: { type: "string" },
        },
        required: ["requirement", "strength", "evidenceIds", "rationale"],
      },
    },
    gaps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "string" },
          type: {
            type: "string",
            enum: ["experience-gap", "knowledge-gap", "missing-evidence"],
          },
          action: { type: "string" },
        },
        required: ["area", "type", "action"],
      },
    },
    researchAndImprovement: { type: "array", items: { type: "string" } },
    positioning: { type: "array", items: { type: "string" } },
    resumeFocus: { type: "array", items: { type: "string" } },
    interviewThemes: { type: "array", items: { type: "string" } },
  },
  required: [
    "executiveSummary",
    "recommendation",
    "fitAssessment",
    "evidenceMatches",
    "gaps",
    "researchAndImprovement",
    "positioning",
    "resumeFocus",
    "interviewThemes"
  ],
} as const;

export const generatedDocumentsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resumeMarkdown: { type: "string" },
    coverLetterMarkdown: { type: "string" },
    interviewPrepMarkdown: { type: "string" },
    validationNotes: { type: "array", items: { type: "string" } },
  },
  required: ["resumeMarkdown", "coverLetterMarkdown", "interviewPrepMarkdown", "validationNotes"],
} as const;
