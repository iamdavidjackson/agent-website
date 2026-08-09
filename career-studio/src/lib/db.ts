import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ApplicationInput, ApplicationRow, ArtifactRow } from "./types";

export async function cloudflareEnv(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env as CloudflareEnv;
}

export async function createApplication(
  env: CloudflareEnv,
  id: string,
  input: ApplicationInput,
): Promise<void> {
  const timestamp = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO applications (
      id, company, job_title, job_url, recruiter_name, job_description, notes,
      status, stage, workflow_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', 'intake', ?, ?, ?)`,
  )
    .bind(
      id,
      input.company,
      input.jobTitle,
      input.jobUrl || null,
      input.recruiterName || null,
      input.jobDescription,
      input.notes || null,
      id,
      timestamp,
      timestamp,
    )
    .run();
}

export async function updateApplicationStage(
  env: CloudflareEnv,
  id: string,
  status: string,
  stage: string,
  error?: string,
): Promise<void> {
  await env.DB.prepare(
    `UPDATE applications
     SET status = ?, stage = ?, error = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(status, stage, error ?? null, new Date().toISOString(), id)
    .run();
}

export async function getApplication(
  env: CloudflareEnv,
  id: string,
): Promise<ApplicationRow | null> {
  return env.DB.prepare("SELECT * FROM applications WHERE id = ?")
    .bind(id)
    .first<ApplicationRow>();
}

export async function listApplications(
  env: CloudflareEnv,
  limit = 20,
): Promise<ApplicationRow[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM applications ORDER BY created_at DESC LIMIT ?",
  )
    .bind(limit)
    .all<ApplicationRow>();
  return result.results;
}

export async function listArtifacts(
  env: CloudflareEnv,
  applicationId: string,
): Promise<ArtifactRow[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM artifacts WHERE application_id = ? ORDER BY kind, format",
  )
    .bind(applicationId)
    .all<ArtifactRow>();
  return result.results;
}

export async function getArtifact(
  env: CloudflareEnv,
  applicationId: string,
  kind: string,
  format: string,
): Promise<ArtifactRow | null> {
  return env.DB.prepare(
    "SELECT * FROM artifacts WHERE application_id = ? AND kind = ? AND format = ?",
  )
    .bind(applicationId, kind, format)
    .first<ArtifactRow>();
}

export async function saveArtifact(
  env: CloudflareEnv,
  applicationId: string,
  kind: string,
  format: "md" | "json" | "pdf",
  body: string | ArrayBuffer,
): Promise<string> {
  const key = `applications/${applicationId}/${kind}.${format}`;
  const contentType =
    format === "pdf"
      ? "application/pdf"
      : format === "json"
        ? "application/json; charset=utf-8"
        : "text/markdown; charset=utf-8";
  await env.ARTIFACTS.put(key, body, { httpMetadata: { contentType } });
  await env.DB.prepare(
    `INSERT INTO artifacts (id, application_id, kind, format, r2_key, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(application_id, kind, format)
     DO UPDATE SET r2_key = excluded.r2_key, created_at = excluded.created_at`,
  )
    .bind(
      `${applicationId}:${kind}:${format}`,
      applicationId,
      kind,
      format,
      key,
      new Date().toISOString(),
    )
    .run();
  return key;
}
