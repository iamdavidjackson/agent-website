---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
inputDocuments:
  - /Users/davjacks/Sites/iamdavidjackson.com/_bmad-output/planning-artifacts/prds/prd-iamdavidjackson.com-2026-05-19/prd.md
---

# iamdavidjackson.com - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown workspace for `iamdavidjackson.com`, starting from the Phase 1 PRD for Career Agent and Resume Studio. This planning pass is intentionally constrained to the resume-first MVP, with recruiter-chat capabilities explicitly deferred to Phase 2.

## Requirements Inventory

### Functional Requirements

FR1: The system must let David create, edit, and organize structured professional profile records including work history, education, skills, certifications, projects, interests, and contact preferences.

FR2: The system must let David store narrative content such as professional philosophy, leadership style, technical opinions, preferred work environments, and reusable written anecdotes.

FR3: The system must let David associate evidence snippets with profile claims so generated materials can be grounded in concrete examples.

FR4: The system must let David provide a job listing by pasted text and preserve the source content used for tailoring.

FR5: The system must identify likely role requirements, themes, and differentiators from a job listing and map them to relevant knowledge-base content.

FR6: The system must derive and persist missing skills from one or more job listings.

FR7: The system must derive and persist market skills David already has when those skills recur across stored job listings.

FR8: The system must let David create and maintain application records for companies and job listings he has pursued.

FR9: The system must let David generate a tailored resume variant for a specific job listing using selected knowledge-base content and a selected resume template.

FR10: The system must let David generate a cover letter draft for a specific job listing grounded in the knowledge base and the role's stated requirements.

FR11: The system must let David review and revise generated application materials before external use.

FR12: The system must let David generate interview cheat sheets tailored to a specific job listing and interview stage.

FR13: The system must let David manage multiple resume templates with different section ordering, styling, and emphasis patterns.

FR14: The system must let David export generated application materials in more than one output format.

FR15: The system must let David inspect which knowledge-base items informed a generated document section.

FR16: The system must let David define preferred writing tone for generated application-facing outputs.

FR17: The system must preserve saved edits to resume variants and cover letter drafts.

FR18: The system must let David review prior applications by company or role.

FR19: The system must distinguish between role-specific skill gaps and repeated market demand across multiple roles.

FR20: The system must ensure generated resumes and cover letters include only claims supported by the knowledge base.

FR21: The system must support the Phase 1 foundation in a way that allows recruiter-chat capabilities to be added later without reworking the underlying knowledge-base model or application history.

### NonFunctional Requirements

NFR1: The system must not fabricate facts about David's experience, dates, credentials, or preferences.

NFR2: Private knowledge-base entries must never appear in recruiter-facing or exported outputs unless explicitly permitted.

NFR3: Resume generation and review must be manageable by one user without a complex admin workflow.

NFR4: The web experience must maintain a practical accessibility baseline for keyboard use and readable structure.

NFR5: The product should remain lightweight enough to run as a personal tool without enterprise-scale operating cost.

NFR6: Exported output must preserve the selected template structure as closely as the target format allows.

NFR7: The product must favor fit, truthfulness, and readability over keyword stuffing or volume optimization.

NFR8: Generated materials should preserve David's intended professional voice.

NFR9: The system should make low-confidence matches or inferred claims visible for review.

### Additional Requirements

- No architecture document was available during extraction, so no architecture-specific implementation constraints were added at this step.
- No UX design document was available during extraction, so UI-specific requirements remain to be elaborated later.
- Current planning scope is Phase 1 only: recruiter chat, anonymous question limiting, recruiter-specific access links, and visual recruiter chat are intentionally deferred.
- The MVP must support application history as a persistent artifact linked to companies, job listings, and generated materials.
- The MVP should include both missing-skill and market-skill tracking as reusable outputs from job-listing analysis.
- The MVP should support at least HR and stakeholder interview cheat-sheet variants.
- Output formats currently assumed in the PRD are PDF and Markdown, with DOCX still an open question.

### UX Design Requirements

No UX design document was available during extraction.

### FR Coverage Map

FR1: Epic 1 - structured professional profile records

FR2: Epic 1 - narrative and reusable writing context

FR3: Epic 1 - evidence snippets and claim grounding

FR4: Epic 2 - job listing intake and source preservation

FR5: Epic 2 - role requirement extraction and relevance mapping

FR6: Epic 2 - missing skill tracking

FR7: Epic 2 - market skill tracking

FR8: Epic 2 - application record management

FR9: Epic 3 - tailored resume generation

FR10: Epic 3 - cover letter generation

FR11: Epic 3 - review and revision workflow

FR12: Epic 4 - interview cheat sheet generation

FR13: Epic 3 - multiple resume template management

FR14: Epic 4 - export in multiple output formats

FR15: Epic 3 - claim traceability in generated materials

FR16: Epic 3 - tone controls for generated outputs

FR17: Epic 3 - persistence of edited resume and cover letter drafts

FR18: Epic 2 - review prior applications by company or role

FR19: Epic 2 - distinguish role-specific gaps from recurring demand

FR20: Epic 3 - ensure generated claims remain knowledge-base supported

FR21: Epics 1, 2, and 3 - preserve a Phase 2-ready data foundation

## Epic List

### Epic 1: Build the Career Knowledge Base
David can create and maintain a trustworthy professional source of truth with structured profile data, narrative context, and evidence-backed claims.
**FRs covered:** FR1, FR2, FR3, FR21

### Epic 2: Analyze Opportunities and Track Applications
David can ingest job listings, understand their requirements, identify skill gaps and strengths, and maintain a persistent application history by company and role.
**FRs covered:** FR4, FR5, FR6, FR7, FR8, FR18, FR19, FR21

### Epic 3: Generate Tailored Application Materials
David can produce, review, revise, and tune tailored resumes and cover letters using grounded knowledge-base content and reusable templates.
**FRs covered:** FR9, FR10, FR11, FR13, FR15, FR16, FR17, FR20, FR21

### Epic 4: Prepare for Interviews and Deliver Final Outputs
David can export polished materials and generate interview cheat sheets that turn application data into practical preparation assets.
**FRs covered:** FR12, FR14, FR16, FR17, FR20

## Epic 1: Build the Career Knowledge Base

Create the single-user foundation that stores David's professional history, narrative voice, and evidence-backed claims in a way that later job-analysis and document-generation flows can rely on safely.

### Story 1.1: Capture Core Career Records

As David,
I want to create and edit my core career records,
So that the system has a reliable foundation for future resume tailoring.

**Acceptance Criteria:**

**Given** I am in the knowledge-base editor  
**When** I add or update work history or education records  
**Then** the system saves titles, organizations, dates, and descriptions as structured records  
**And** I can return later and edit them without losing prior data.

**Given** I have multiple records  
**When** I review the list of work history or education entries  
**Then** the system presents them in a manageable ordered view  
**And** archived records remain stored without cluttering active editing.

### Story 1.2: Manage Skills, Projects, and Supporting Profile Data

As David,
I want to maintain skills, projects, interests, certifications, and contact preferences,
So that my knowledge base reflects the full shape of my professional profile.

**Acceptance Criteria:**

**Given** I am editing my profile  
**When** I add or update skills, projects, interests, certifications, or contact preferences  
**Then** each item is stored as a distinct editable record  
**And** the system supports later reuse of those records in generated materials.

**Given** I no longer want an item emphasized  
**When** I mark it as hidden or archived  
**Then** the record remains available internally  
**And** it is excluded from default outward-facing generation flows.

### Story 1.3: Store Narrative Voice and Reusable Writing Context

As David,
I want to save narrative background, opinions, and reusable writing snippets,
So that generated materials sound more like me and less like a generic template.

**Acceptance Criteria:**

**Given** I want to capture narrative context  
**When** I create a long-form entry such as professional philosophy, leadership style, or a reusable anecdote  
**Then** the system stores the entry as tagged narrative content  
**And** I can later target it for resume, cover letter, or interview-prep use.

**Given** I have multiple narrative entries  
**When** I review them  
**Then** I can distinguish them by topic and intended usage  
**And** the system preserves my wording for future reuse.

### Story 1.4: Attach Evidence and Visibility Controls to Claims

As David,
I want to connect claims to evidence and control their visibility,
So that generated outputs stay truthful and appropriate for the audience.

**Acceptance Criteria:**

**Given** I have a skill, role, or project record  
**When** I attach an evidence snippet to it  
**Then** the system stores that evidence as linked support for the claim  
**And** later generation flows can reference the link for traceability.

**Given** a profile item or evidence snippet contains sensitive information  
**When** I classify it with a visibility setting  
**Then** the system enforces that setting in downstream outputs  
**And** private content is not exposed by default.

## Epic 2: Analyze Opportunities and Track Applications

Turn job opportunities into reusable structured inputs by storing listings, extracting requirements, surfacing skill insights, and maintaining application history.

### Story 2.1: Save Job Listings for Tailoring

As David,
I want to save a pasted job listing as a reusable record,
So that tailoring and application tracking can start from a stable source document.

**Acceptance Criteria:**

**Given** I have copied a job description  
**When** I paste it into the system and save it  
**Then** the system stores the listing content as a job-listing record  
**And** the source text remains available for later review and regeneration.

**Given** I save multiple job listings  
**When** I browse or search them  
**Then** I can identify each listing by company, title, or date  
**And** open a saved listing for further work.

### Story 2.2: Extract Role Requirements and Relevant Evidence

As David,
I want the system to summarize what a job listing is asking for,
So that I can quickly see how my background maps to the opportunity.

**Acceptance Criteria:**

**Given** a saved job listing exists  
**When** I run analysis on it  
**Then** the system extracts key requirements, themes, and differentiators  
**And** presents a structured summary rather than only freeform prose.

**Given** the job-listing analysis is complete  
**When** the system compares the listing to my knowledge base  
**Then** it identifies relevant skills, experiences, and evidence snippets  
**And** low-confidence matches are visibly flagged for review.

### Story 2.3: Track Missing Skills and Market Skills

As David,
I want the system to distinguish between skills I am missing and strengths the market repeatedly asks for,
So that I can improve both my positioning and my learning roadmap.

**Acceptance Criteria:**

**Given** one or more job listings have been analyzed  
**When** the system evaluates requested skills against my knowledge base  
**Then** it stores unmatched requests as missing skills  
**And** it stores repeated matched requests as market skills.

**Given** a skill insight has been stored  
**When** I review the job-analysis results  
**Then** I can tell whether the item is a role-specific gap or a recurring market signal  
**And** I can revisit those saved insights later without reprocessing the listing.

### Story 2.4: Maintain Application Records and History

As David,
I want to track where I have applied and what materials I used,
So that I can manage my job search without separate external notes.

**Acceptance Criteria:**

**Given** a company and job listing exist  
**When** I create an application record  
**Then** the system stores company, role, status, dates, and linked generated materials  
**And** that record persists independently of future edits.

**Given** I have multiple applications  
**When** I review my history  
**Then** I can filter or scan by company or role  
**And** open an application record to see the associated listing and materials.

## Epic 3: Generate Tailored Application Materials

Use the knowledge base and job-analysis data to generate grounded resumes and cover letters, with editable outputs, traceability, and template control.

### Story 3.1: Generate a Tailored Resume with a Default Template

As David,
I want to generate a tailored resume from a saved job listing and my knowledge base,
So that I can start from a strong first draft instead of rewriting from scratch.

**Acceptance Criteria:**

**Given** I have a saved job listing and populated knowledge base  
**When** I generate a resume using the default template  
**Then** the system creates a resume variant emphasizing relevant experience and skills  
**And** the output excludes unsupported claims.

**Given** the job listing includes ambiguous requirements  
**When** the system builds the resume  
**Then** uncertain matches are surfaced for review  
**And** the draft remains editable before any export.

### Story 3.2: Review, Edit, and Save Resume Variants with Traceability

As David,
I want to inspect and edit generated resumes with visibility into where claims came from,
So that I can trust and refine the draft before using it externally.

**Acceptance Criteria:**

**Given** a generated resume variant exists  
**When** I review a section or claim  
**Then** the system can show the linked knowledge-base items or evidence snippets that informed it  
**And** unsupported content is not presented as grounded.

**Given** I make edits to a resume variant  
**When** I save my changes  
**Then** the edited version persists as the current draft  
**And** later visits reopen my saved edits rather than regenerating over them automatically.

### Story 3.3: Generate Cover Letters with Tone Controls

As David,
I want to generate a cover letter in a chosen tone,
So that I can adapt the application message to different companies without losing authenticity.

**Acceptance Criteria:**

**Given** a saved job listing and relevant knowledge-base content exist  
**When** I generate a cover letter draft  
**Then** the system produces a job-specific letter grounded in supported claims  
**And** it reflects the selected writing tone guidance.

**Given** I revise the cover letter  
**When** I save the updated draft  
**Then** the saved version persists for future editing or export  
**And** regenerated drafts do not silently overwrite my edits.

### Story 3.4: Manage Multiple Resume Templates

As David,
I want to maintain more than one resume template,
So that I can tailor presentation style to different opportunities and audiences.

**Acceptance Criteria:**

**Given** I want different resume layouts  
**When** I create or update a resume template definition  
**Then** the system stores its section ordering and emphasis rules separately from underlying profile data  
**And** that template becomes selectable during resume generation.

**Given** multiple templates exist  
**When** I generate a resume variant with a different template  
**Then** the presentation changes according to the chosen template  
**And** the underlying job listing and knowledge-base facts remain unchanged.

## Epic 4: Prepare for Interviews and Deliver Final Outputs

Turn tailored drafts into practical assets by supporting export and stage-specific interview preparation.

### Story 4.1: Export Application Materials in Practical Formats

As David,
I want to export my saved resume and cover letter drafts,
So that I can use them in real application workflows.

**Acceptance Criteria:**

**Given** I have a saved resume or cover letter draft  
**When** I choose an export option  
**Then** the system produces the document in a supported format  
**And** the exported structure follows the selected template as closely as the format allows.

**Given** the MVP format assumptions are PDF and Markdown  
**When** I export a document  
**Then** both supported formats are available  
**And** the exported file remains tied to the originating draft record.

### Story 4.2: Generate an HR Screening Cheat Sheet

As David,
I want a lightweight interview-prep cheat sheet for early recruiter or HR screens,
So that I can quickly align my talking points to the role before the first conversation.

**Acceptance Criteria:**

**Given** a job listing and application record exist  
**When** I generate an HR-stage cheat sheet  
**Then** the system summarizes likely talking points, relevant strengths, and safe positioning themes  
**And** those points are grounded in my knowledge base.

**Given** the role analysis includes gaps or low-confidence areas  
**When** the cheat sheet is generated  
**Then** the system highlights those areas for caution  
**And** avoids presenting speculative claims as facts.

### Story 4.3: Generate Stakeholder Interview Cheat Sheets

As David,
I want later-round interview cheat sheets with deeper examples,
So that I can prepare for hiring-manager and stakeholder conversations with better evidence and specificity.

**Acceptance Criteria:**

**Given** a job listing and application record exist  
**When** I generate a stakeholder-stage cheat sheet  
**Then** the system includes stage-appropriate talking points, supporting examples, and likely emphasis areas  
**And** it differentiates this content from the lighter HR-stage version.

**Given** the cheat sheet references experience examples  
**When** I inspect those talking points  
**Then** the system can show which knowledge-base items or evidence snippets support them  
**And** I can use that context to refine the final talking points.
