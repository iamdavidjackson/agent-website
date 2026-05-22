---
title: Career Agent and Resume Studio
status: draft
created: 2026-05-19
updated: 2026-05-19
---

# PRD: Career Agent and Resume Studio

## 0. Document Purpose
This PRD captures the first requirements draft for a personal career platform that represents David to recruiters, maintains a structured knowledge base about his background, and generates tailored resumes and cover letters for specific job listings. It is written to help guide product scoping, architecture, UX planning, and implementation sequencing.

This draft is intentionally early-stage. It uses `[ASSUMPTION: ...]` tags where the product direction is implied but not yet explicitly decided.

## 1. Vision
Career Agent and Resume Studio is a personal AI system that acts as a persistent professional memory and a controlled public-facing representative. It should help David present himself consistently, accurately, and efficiently across recruiter conversations and job applications.

The product combines two high-value outcomes in one workflow. First, it gives recruiters an interactive chat agent that can answer questions about David's experience, skills, education, interests, and viewpoints. Second, it turns the same knowledge base into tailored application materials such as resumes, CVs, and cover letters that fit specific job listings and output formats.

The core value is leverage: David invests once in a rich, evidence-backed knowledge base, and the system reuses that knowledge across conversations and document generation without forcing him to rewrite his story for every opportunity.

## 2. Target User

### 2.1 Primary Persona
David is an experienced professional who wants to present his background clearly and consistently while reducing the overhead of repetitive job-search tasks. He cares about quality, nuance, and personal voice, and he does not want automation to misrepresent him.

### 2.2 Secondary Persona
Recruiters are secondary users. They want quick, trustworthy answers about David's fit, experience, interests, availability, and preferences without waiting for asynchronous follow-up.

### 2.3 Jobs To Be Done
- Maintain a reliable source of truth about David's career history, capabilities, achievements, and preferences.
- Answer recruiter questions quickly without forcing David to manually repeat the same information.
- Adapt David's experience into role-specific resumes and cover letters without starting from a blank page.
- Preserve David's tone and point of view while avoiding fabricated claims.
- Support multiple professional presentation formats for different hiring contexts.

### 2.4 Non-Users (v1)
- Employers seeking a full candidate screening or assessment platform.
- General consumers looking for a generic AI resume builder with no personal knowledge system.
- Fully autonomous job-application systems that apply to jobs without review.

### 2.5 Key User Journeys
- **UJ-1. Recruiter gets an immediate, grounded answer.**
  - **Persona + context:** A recruiter receives David's website or profile link and wants to assess fit quickly.
  - **Entry state:** The recruiter lands on the site and opens the chat agent, either anonymously or via a recruiter-specific link.
  - **Path:** The recruiter asks about David's experience, relevant skills, work history, or preferences; the agent retrieves grounded knowledge; the agent responds in a professional tone and can reference supporting detail, and may present supporting visuals when relevant.
  - **Climax:** The recruiter gets a useful answer that helps them decide whether to continue the conversation.
  - **Resolution:** The recruiter either asks a follow-up question or reaches out to David through a defined contact path.
  - **Edge case:** If the answer is uncertain or not in the knowledge base, or the anonymous question limit has been reached, the agent says so and offers a fallback such as contacting David directly.

- **UJ-2. David tailors a resume to a specific job listing.**
  - **Persona + context:** David finds a role he wants to pursue and wants a fast but high-quality first draft.
  - **Entry state:** David is authenticated in the admin/editor workflow and provides a job listing URL or pasted description.
  - **Path:** The system extracts job requirements, maps them to relevant experience and skills in the knowledge base, selects a resume template, and generates a tailored resume draft plus optional cover letter.
  - **Climax:** David receives a role-specific application package that highlights the strongest relevant evidence.
  - **Resolution:** David reviews, edits, exports, and uses the materials for an application.
  - **Edge case:** If the listing is vague or mismatched, the system flags low-confidence tailoring rather than overstating fit.

- **UJ-3. David updates his professional knowledge base.**
  - **Persona + context:** David wants the system to stay current as his experience evolves.
  - **Entry state:** David opens the admin/editor workflow.
  - **Path:** He adds or edits achievements, projects, opinions, interests, education, work history, and reusable writing snippets; the system stores structured and narrative data; changes become available to downstream chat and document-generation flows.
  - **Climax:** The new information is reflected in future conversations and generated materials.
  - **Resolution:** David trusts that the platform reflects his latest professional story.

## 3. Glossary
- **Knowledge Base** — The structured and narrative repository describing David's career, skills, education, interests, opinions, projects, achievements, and preferences.
- **Recruiter Agent** — The chat experience that answers recruiter questions on David's behalf using the Knowledge Base.
- **Job Listing** — A role description, whether pasted manually or fetched from a URL, used to tailor application materials.
- **Resume Template** — A reusable document layout and formatting definition for resume generation.
- **Resume Variant** — A generated resume customized for a specific Job Listing and Resume Template.
- **Cover Letter Draft** — A generated letter customized for a specific Job Listing and grounded in the Knowledge Base.
- **Evidence Snippet** — A specific fact, example, quote, achievement, or experience detail used to justify a generated answer or tailored document claim.
- **Confidence Flag** — A visible indicator that a response or generated claim is uncertain, incomplete, or requires David's review.
- **Application Record** — A stored record that links a company, Job Listing, generated materials, outreach status, and recruiter interactions.
- **Recruiter Access Link** — A shareable link containing a code or token that identifies a recruiter or company context for a chat session.
- **Missing Skill** — A skill frequently requested by target roles that David does not currently claim in the Knowledge Base.
- **Market Skill** — A skill David has that appears repeatedly across stored Job Listings and is worth emphasizing in generated materials.
- **Interview Cheat Sheet** — A stage-specific briefing document with talking points, examples, and likely emphasis areas for a particular interview round.

## 4. Features

### 4.1 Knowledge Base Authoring and Organization
**Description:** David can create and maintain a high-quality Knowledge Base that mixes structured career data with narrative context. The system should support both factual data entry and richer qualitative context so that outputs do not feel generic. Realizes UJ-3. `[ASSUMPTION: the initial system is single-user and centered on David as the only profile owner.]`

**Functional Requirements:**

#### FR-1: Structured professional profile management
David can create, edit, and organize core profile records including work history, education, skills, certifications, projects, interests, and contact preferences. Realizes UJ-3.

**Consequences (testable):**
- The system stores each profile area as editable records rather than a single freeform blob.
- David can add start/end dates, titles, organizations, and descriptions for work and education entries.
- David can mark records as active, archived, or hidden from recruiter-facing outputs.

#### FR-2: Narrative and opinion capture
David can store longer-form narrative content such as professional philosophy, leadership style, technical opinions, preferred work environments, and reusable written anecdotes. Realizes UJ-3.

**Consequences (testable):**
- The system accepts long-form text entries tagged by topic.
- Entries can be labeled for use in recruiter chat, resume generation, cover letters, or internal-only drafting.
- The system preserves author-entered wording for later reuse.

#### FR-3: Evidence-backed knowledge organization
David can associate Evidence Snippets with profile claims so downstream outputs can be grounded in concrete examples. Realizes UJ-2, UJ-3.

**Consequences (testable):**
- Skills, roles, and achievements can reference one or more Evidence Snippets.
- The system can retrieve supporting examples when generating recruiter answers or tailored documents.
- Hidden or internal-only evidence is excluded from public-facing outputs.

### 4.2 Recruiter Conversation Agent
**Description:** The Recruiter Agent answers questions from recruiters using the Knowledge Base while staying within defined truthfulness and tone constraints. The goal is not to sound omniscient; it is to be helpful, professional, and trustworthy. Realizes UJ-1. `[ASSUMPTION: the initial agent is text-chat only, with voice deferred.]`

**Functional Requirements:**

#### FR-4: Grounded recruiter Q&A
A recruiter can ask the Recruiter Agent questions about David's background, experience, skills, interests, and preferences, and the agent responds using Knowledge Base content. Realizes UJ-1.

**Consequences (testable):**
- The agent can answer questions using retrieved Knowledge Base material.
- The response stays within the scope of information available in the Knowledge Base.
- The response tone is professional and representative of David.

#### FR-5: Uncertainty and fallback handling
The Recruiter Agent can decline, qualify, or redirect when a question cannot be answered safely from the Knowledge Base. Realizes UJ-1.

**Consequences (testable):**
- When no grounded answer exists, the agent states that it does not have enough information.
- The agent does not invent employers, titles, dates, skills, achievements, or opinions.
- The agent can suggest a contact or follow-up path when the answer requires David directly.

#### FR-6: Recruiter-safe conversation boundaries
David can define categories of information the Recruiter Agent may answer, should answer cautiously, or must not answer publicly. Realizes UJ-1, UJ-3.

**Consequences (testable):**
- The system supports at least three visibility states for Knowledge Base content: public-facing, drafting-only, and private.
- The Recruiter Agent excludes private content from recruiter conversations.
- Restricted topics trigger a refusal or redirect rather than disclosure.

#### FR-7: Anonymous usage limits
David can set limits on how many questions an anonymous user may ask before the Recruiter Agent stops or redirects the conversation. Realizes UJ-1.

**Consequences (testable):**
- The system supports a configurable anonymous question limit.
- The Recruiter Agent tracks anonymous-session usage against that limit.
- When the limit is reached, the agent stops answering further questions and presents a defined fallback such as contact information or a recruiter-specific access path.

### 4.3 Job Listing Ingestion and Matching
**Description:** The system interprets a Job Listing and maps its themes and requirements to the most relevant parts of the Knowledge Base. This is the bridge between raw opportunity data and tailored application material. Realizes UJ-2.

**Functional Requirements:**

#### FR-8: Job listing intake
David can provide a Job Listing by pasted text and optionally by URL. Realizes UJ-2.

**Consequences (testable):**
- The system accepts pasted role descriptions.
- `[ASSUMPTION: URL-based extraction is supported in a later MVP increment if scraping is brittle.]`
- The stored Job Listing preserves the source content used for tailoring.

#### FR-9: Requirement extraction and relevance mapping
The system can identify likely role requirements, themes, and differentiators from a Job Listing and map them to relevant Knowledge Base content. Realizes UJ-2.

**Consequences (testable):**
- The system produces a structured summary of the Job Listing's key needs.
- The system selects matching skills, experiences, and Evidence Snippets from the Knowledge Base.
- Low-confidence matches are surfaced with a Confidence Flag.

#### FR-10: Skill-gap and market-skill tracking
The system can derive and persist both Missing Skills and Market Skills from stored Job Listings. Realizes UJ-2.

**Consequences (testable):**
- The system can save Missing Skills identified from one or more Job Listings.
- The system can save Market Skills that David already has and that recur across stored Job Listings.
- The system can distinguish between role-specific gaps and repeated market demand across multiple roles.

### 4.4 Application and Recruiter Relationship Tracking
**Description:** The system remembers where David has applied, which recruiters are associated with those opportunities, and how recruiter-facing chat sessions relate to specific companies. This turns the product from a one-off generator into a useful career operating system.

**Functional Requirements:**

#### FR-11: Application record management
David can create and maintain an Application Record for companies and Job Listings he has pursued. Realizes UJ-2.

**Consequences (testable):**
- The system can store company name, Job Listing, application status, dates, and linked Resume Variants or Cover Letter Drafts.
- David can review a list of prior applications by company or role.
- Application history persists independently of chat sessions.

#### FR-12: Recruiter identification and contextual access
The system can associate a recruiter-facing conversation with a specific company or recruiter context, including through a Recruiter Access Link. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- David can generate a recruiter-specific link or code tied to an Application Record or company context.
- When a recruiter uses that link, the chat session inherits the related company or role context.
- The system can distinguish recruiter-linked sessions from anonymous sessions for tracking and cost control.

### 4.5 Resume and Cover Letter Generation
**Description:** David can generate tailored application materials that reflect both the Job Listing and his authentic profile. The generated output should save time without removing review and editorial control. Realizes UJ-2.

**Functional Requirements:**

#### FR-13: Tailored resume generation
David can generate a Resume Variant for a specific Job Listing using selected Knowledge Base content and a selected Resume Template. Realizes UJ-2.

**Consequences (testable):**
- The generated Resume Variant emphasizes experience relevant to the Job Listing.
- The system does not introduce claims not supported by the Knowledge Base.
- The generated Resume Variant can be regenerated after editing the Knowledge Base or changing the Resume Template.

#### FR-14: Cover letter generation
David can generate a Cover Letter Draft for a specific Job Listing grounded in the Knowledge Base and the role's stated requirements. Realizes UJ-2.

**Consequences (testable):**
- The generated Cover Letter Draft references job-relevant experience and interests.
- The tone can be configured to avoid sounding generic or overly automated.
- The generated Cover Letter Draft includes only claims traceable to Knowledge Base content.

#### FR-15: Human review before export
David can review and revise generated application materials before using them externally. Realizes UJ-2.

**Consequences (testable):**
- Generated materials are editable before export.
- The system does not automatically send, publish, or submit application materials.
- The latest saved edits persist with the Resume Variant or Cover Letter Draft.

### 4.6 Interview Preparation
**Description:** The platform helps David prepare for interviews by turning the Job Listing and Application Record into practical, stage-specific talking points and reminders. The output should support real conversations, not just document generation.

**Functional Requirements:**

#### FR-16: Interview cheat sheet generation
David can generate an Interview Cheat Sheet tailored to a specific Job Listing and interview stage such as HR screening, hiring-manager interview, or stakeholder panel. Realizes UJ-2.

**Consequences (testable):**
- The system can generate different cheat-sheet variants for different interview rounds.
- Each Interview Cheat Sheet includes likely emphasis areas, suggested talking points, and supporting examples from the Knowledge Base.
- The generated Interview Cheat Sheet distinguishes between universally safe points and stage-specific talking points.

### 4.7 Template and Output Management
**Description:** The platform supports multiple Resume Templates and output modes so David can adapt presentation style to different employers and contexts. Realizes UJ-2.

**Functional Requirements:**

#### FR-17: Multiple template support
David can manage multiple Resume Templates with different section ordering, styling, and emphasis patterns. Realizes UJ-2.

**Consequences (testable):**
- The system can store more than one Resume Template.
- David can choose a Resume Template during Resume Variant generation.
- Template changes alter formatting and ordering without changing underlying Knowledge Base facts.

#### FR-18: Multiple export formats
David can export generated application materials in more than one output format. Realizes UJ-2.

**Consequences (testable):**
- `[ASSUMPTION: PDF and Markdown are the first required formats; DOCX may be a later need.]`
- Export preserves the selected Resume Template structure as closely as the target format allows.
- Exported files are downloadable and tied to the underlying Resume Variant or Cover Letter Draft.

#### FR-19: Visual recruiter presentation
The Recruiter Agent can present selected information in a visual format, including images or portfolio-style media, when those assets are available and appropriate to the conversation. Realizes UJ-1.

**Consequences (testable):**
- The system can attach or embed images associated with projects, work samples, or Evidence Snippets.
- Visual content obeys the same visibility and privacy controls as text content.
- The chat interface can mix text answers with visual cards, media, or structured presentation blocks rather than plain text only.

### 4.8 Trust, Auditability, and Personal Voice
**Description:** Because this product represents a real person in high-stakes contexts, it must favor trust, traceability, and tone control over pure generation speed. Realizes UJ-1, UJ-2, UJ-3.

**Functional Requirements:**

#### FR-20: Claim traceability
David can inspect which Knowledge Base items informed a recruiter response or generated document section. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- The system can show the Knowledge Base records or Evidence Snippets used for a generated output.
- A reviewer can identify unsupported claims before external use.
- Traceability works for both recruiter chat responses and generated documents.

#### FR-21: Voice and tone controls
David can define preferred writing and speaking tone for recruiter-facing and application-facing outputs. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- The system stores reusable tone guidance such as concise, warm, direct, technical, or executive.
- Different output types can use different tone presets.
- Tone changes affect wording style without changing factual content.

## 5. Non-Goals (Explicit)
- The product is not a general-purpose AI career coach for the public in v1.
- The product is not a mass-application bot that applies to roles automatically.
- The product is not a candidate ranking or ATS analytics platform.
- The product is not a substitute for David's judgment on sensitive, strategic, or ambiguous questions.
- The product is not required to support multiple end-user profiles in v1.
- The product is not a general-purpose portfolio CMS for arbitrary public galleries in v1.

## 6. MVP Scope

### 6.1 In Scope
- Single-user Knowledge Base for David.
- Manual Knowledge Base authoring and editing.
- Job Listing intake via pasted text.
- Saved Application Records by company and role.
- Saved Missing Skills and Market Skills derived from Job Listings.
- Tailored resume generation for a provided Job Listing.
- At least one cover letter generation workflow.
- Interview Cheat Sheet generation for at least HR and stakeholder rounds.
- Multiple Resume Templates.
- Export in at least one presentation-grade format and one editable format.
- Basic visual presentation support for recruiter chat, such as project images.
- Basic traceability and confidence signaling.

### 6.2 Out of Scope for MVP
- Text-based Recruiter Agent grounded in the Knowledge Base.
- Anonymous question limiting for public chat.
- Recruiter-specific links or codes for contextual chat sessions.
- Voice calls or live phone-agent behavior.
- Automatic job application submission.
- Public multi-tenant account support.
- Deep ATS optimization analytics beyond basic tailoring.
- Full social/profile synchronization from external services.
- Autonomous outreach to recruiters without review.
- Rich multimedia storytelling experiences beyond lightweight visual evidence presentation.

### 6.3 MVP Rationale
The MVP centers on the Knowledge Base plus resume-generation workflow rather than recruiter chat. This path delivers immediate value with lower implementation risk, lower token cost, simpler safety requirements, and a clearer review loop. It also builds the foundational data model the Recruiter Agent will later depend on.

### 6.4 Phase Recommendation

**Phase 1: Resume-first MVP**
- Knowledge Base authoring, organization, and visibility controls.
- Job Listing intake and requirement extraction.
- Missing Skill and Market Skill tracking.
- Tailored resume generation.
- Cover letter generation.
- Application Record tracking.
- Interview Cheat Sheet generation.
- Multiple Resume Templates and export.
- Claim traceability and tone controls for generated materials.

**Phase 2: Recruiter-facing Agent**
- Public or semi-public recruiter chat experience.
- Anonymous question limiting and token controls.
- Recruiter-specific links or codes tied to company context.
- Recruiter-session tracking and follow-up flow.
- Visual recruiter chat presentation with project images or work samples.
- Expanded conversation safety and privacy controls for public interaction.

## 7. Success Metrics

**Primary**
- **SM-1**: David can produce a high-quality first draft of a tailored resume for a new Job Listing in under 15 minutes including review. Validates FR-8, FR-9, FR-13, FR-15, FR-17.
- **SM-2**: At least 90% of factual claims in sampled generated application materials are directly traceable to Knowledge Base records or Evidence Snippets. Validates FR-3, FR-13, FR-14, FR-20.
- **SM-3**: David can accurately review prior applications and identify company context for active opportunities without relying on external notes. Validates FR-11.

**Secondary**
- **SM-5**: David reports that the generated outputs preserve his intended professional voice in at least 8 out of 10 review sessions. Validates FR-2, FR-14, FR-21.
- **SM-6**: David maintains and reuses the Knowledge Base over time rather than recreating resume content from scratch for each role. Validates FR-1, FR-2, FR-3.
- **SM-7**: Generated Interview Cheat Sheets are useful enough that David uses them in real interview prep for multiple stages. Validates FR-16.
- **SM-8**: The system identifies recurring Market Skills and Missing Skills across stored Job Listings in a way David considers actionable. Validates FR-10.
- **SM-9**: A future recruiter-chat phase can be added without reworking the underlying Knowledge Base model or application history. Validates FR-1, FR-3, FR-11.

**Counter-metrics (do not optimize)**
- **SM-C1**: Number of auto-generated applications sent. This should not be optimized because the product should favor fit and truthfulness over volume. Counterbalances SM-1.
- **SM-C2**: Maximum keyword stuffing or ATS-style optimization regardless of fit. This should not be optimized if it makes the output less truthful, less readable, or less representative of David. Counterbalances SM-1, SM-2.
- **SM-C3**: Number of anonymous recruiter questions answered. This should not be optimized in later phases if it increases token cost without improving qualified recruiter engagement.

## 8. Cross-Cutting NFRs
- **Truthfulness:** The system must not fabricate facts about David's experience, dates, credentials, or preferences.
- **Privacy:** Private Knowledge Base entries must never appear in recruiter-facing outputs.
- **Performance:** Common recruiter chat responses should feel near-interactive. `[ASSUMPTION: target response time is under 5 seconds for standard questions.]`
- **Usability:** Resume generation and review should be manageable by one user without a complex admin workflow.
- **Accessibility:** The web experience should meet a practical accessibility baseline for keyboard use and readable structure.
- **Cost Control:** Anonymous recruiter chat must support configurable controls that cap token exposure.
- **Media Handling:** Visual assets used in chat should load reliably and preserve appropriate presentation quality.

## 9. Constraints and Guardrails

### 9.1 Safety
- The system should represent David accurately rather than maximize persuasion at any cost.
- The system should visibly distinguish grounded answers from uncertain inferences.

### 9.2 Privacy
- Sensitive personal details should be deliberately classified before public exposure.
- Recruiter-facing content should be limited to what David explicitly permits.

### 9.3 Cost
- `[ASSUMPTION: the product should stay lightweight enough to run as a personal tool without enterprise-scale operating cost.]`
- Anonymous or public-facing chat should be constrained so curiosity traffic does not create unbounded token spend.

## 10. Why Now
Recent improvements in retrieval and generation make it practical to turn a personal knowledge base into both a recruiter-facing agent and a reusable application-material engine. The timing matters because the same underlying asset, a structured professional memory, can now support multiple high-friction job-search workflows from a single source of truth.

## 11. Open Questions
1. Resolved for current planning: the first release prioritizes resume generation over recruiter chat. What concrete exit criteria would justify starting Phase 2?
2. Which content types belong in the Knowledge Base schema from day one: work history, projects, skills, opinions, testimonials, writing samples, references?
3. How much editing structure is needed for Evidence Snippets and traceability to feel trustworthy?
4. What formats are truly required for export in MVP: PDF, Markdown, DOCX, plain text, JSON?
5. Should the MVP export set be PDF plus Markdown, or is DOCX required from day one?
6. Should the system store prior Job Listings, Application Records, and generated Resume Variants as reusable history?
7. What level of ATS-oriented optimization is helpful versus gimmicky?
8. How should David review and approve restricted topics, private content, and fallback behavior inside generated materials?
9. What is the preferred way to ingest existing resume material and historical career documents into the first Knowledge Base?
10. Which interview stages need distinct Interview Cheat Sheet formats beyond HR and stakeholder rounds?
11. For Phase 2, should recruiter chat be fully public on the website, gated behind a prompt, or primarily shared via Recruiter Access Links?
12. For Phase 2, what should the default anonymous question limit be, and what should happen when the limit is reached?
13. For Phase 2, how much personality should the Recruiter Agent express when answering opinion-based questions?
14. For Phase 2, what kinds of visual assets should be supported first: screenshots, case-study images, diagrams, PDFs, or short embedded media?

## 12. Assumptions Index
- §4.1 Knowledge Base Authoring and Organization — `[ASSUMPTION: the initial system is single-user and centered on David as the only profile owner.]`
- §4.2 Recruiter Conversation Agent — `[ASSUMPTION: the initial agent is text-chat only, with voice deferred.]`
- §4.3 Job Listing Ingestion and Matching — `[ASSUMPTION: URL-based extraction is supported in a later MVP increment if scraping is brittle.]`
- §4.5 Template and Output Management — `[ASSUMPTION: PDF and Markdown are the first required formats; DOCX may be a later need.]`
- §8 Cross-Cutting NFRs — `[ASSUMPTION: target response time is under 5 seconds for standard questions.]`
- §9.3 Cost — `[ASSUMPTION: the product should stay lightweight enough to run as a personal tool without enterprise-scale operating cost.]`
