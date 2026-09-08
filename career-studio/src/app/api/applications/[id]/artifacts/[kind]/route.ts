import { cloudflareEnv, getApplication, getArtifact } from "@/lib/db";

const KINDS = new Set([
  "application-brief",
  "fit-analysis",
  "resume",
  "cover-letter",
  "interview-prep",
  "validation",
]);
const FORMATS = new Set(["md", "json", "pdf"]);

type RouteContext = { params: Promise<{ id: string; kind: string }> };

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id, kind } = await context.params;
  const format = new URL(request.url).searchParams.get("format") || "md";
  if (!KINDS.has(kind) || !FORMATS.has(format)) {
    return Response.json({ error: "Unsupported artifact." }, { status: 400 });
  }

  const env = await cloudflareEnv();
  const [application, artifact] = await Promise.all([
    getApplication(env, id),
    getArtifact(env, id, kind, format),
  ]);
  if (!application || !artifact) {
    return Response.json({ error: "Artifact not found." }, { status: 404 });
  }

  const object = await env.ARTIFACTS.get(artifact.r2_key);
  if (!object) {
    return Response.json({ error: "Artifact file not found." }, { status: 404 });
  }

  const safeCompany = application.company.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const filename = `${safeCompany}-${kind}.${format}`;
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  headers.set("Cache-Control", "private, no-store");
  headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
}
