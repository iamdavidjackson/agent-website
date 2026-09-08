import { getCloudflareContext } from "@opennextjs/cloudflare";

export const JOB_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;

type JobProfile = {
  companyName: string;
  recruiterName: string;
};

type ApplicationRecord = {
  company: string;
  job_title: string;
  job_url: string | null;
  recruiter_name: string | null;
  job_description: string;
};

type ArtifactRecord = {
  r2_key: string;
};

type PreparedStatement = {
  bind(...values: unknown[]): PreparedStatement;
  first<T>(): Promise<T | null>;
};

type CareerBindings = {
  CAREER_DB?: {
    prepare(query: string): PreparedStatement;
  };
  CAREER_ARTIFACTS?: {
    get(key: string): Promise<{ text(): Promise<string> } | null>;
  };
};

function validJobId(jobId: string | undefined): jobId is string {
  return Boolean(jobId && JOB_ID_PATTERN.test(jobId));
}

async function careerBindings(): Promise<CareerBindings> {
  const { env } = await getCloudflareContext({ async: true });
  return env as CareerBindings;
}

async function loadApplication(
  jobId: string | undefined,
): Promise<ApplicationRecord | null> {
  if (!validJobId(jobId)) return null;

  try {
    const { CAREER_DB } = await careerBindings();
    if (!CAREER_DB) return null;

    return await CAREER_DB.prepare(
      `SELECT company, job_title, job_url, recruiter_name, job_description
       FROM applications
       WHERE id = ? AND status = 'complete'`,
    )
      .bind(jobId)
      .first<ApplicationRecord>();
  } catch (error) {
    console.error("Unable to load application context", error);
    return null;
  }
}

export async function loadJobProfile(
  jobId: string | undefined,
): Promise<JobProfile | undefined> {
  const application = await loadApplication(jobId);
  if (!application) return undefined;

  return {
    companyName: application.company,
    recruiterName: application.recruiter_name ?? "",
  };
}

export async function loadJobContext(
  jobId: string | undefined,
): Promise<string> {
  if (!validJobId(jobId)) return "";

  try {
    const [{ CAREER_DB, CAREER_ARTIFACTS }, application] = await Promise.all([
      careerBindings(),
      loadApplication(jobId),
    ]);
    if (!CAREER_DB || !CAREER_ARTIFACTS || !application) return "";

    const artifact = await CAREER_DB.prepare(
      `SELECT r2_key
       FROM artifacts
       WHERE application_id = ? AND kind = 'resume' AND format = 'md'`,
    )
      .bind(jobId)
      .first<ArtifactRecord>();
    if (!artifact) return "";

    const resumeObject = await CAREER_ARTIFACTS.get(artifact.r2_key);
    if (!resumeObject) return "";

    const resume = await resumeObject.text();
    return `APPLICATION
Company: ${application.company}
Role: ${application.job_title}
Recruiter: ${application.recruiter_name || "Not provided"}
Job URL: ${application.job_url || "Not provided"}

JOB DESCRIPTION
${application.job_description}

TAILORED RESUME
${resume}`;
  } catch (error) {
    console.error("Unable to load job-specific context", error);
    return "";
  }
}
