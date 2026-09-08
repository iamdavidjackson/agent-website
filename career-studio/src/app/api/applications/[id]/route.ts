import {
  cloudflareEnv,
  getApplication,
  getArtifact,
  listArtifacts,
} from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const env = await cloudflareEnv();
  const application = await getApplication(env, id);
  if (!application) {
    return Response.json({ error: "Application not found." }, { status: 404 });
  }

  const [artifacts, workflowStatus] = await Promise.all([
    listArtifacts(env, id),
    env.CAREER_WORKFLOW
      .get(application.workflow_id)
      .then((instance) => instance.status())
      .catch(() => ({ status: application.status })),
  ]);
  const fitArtifact = await getArtifact(env, id, "fit-analysis", "md");
  const fitObject = fitArtifact
    ? await env.ARTIFACTS.get(fitArtifact.r2_key)
    : null;
  const fitAnalysis = fitObject ? await fitObject.text() : null;

  return Response.json({ application, artifacts, workflowStatus, fitAnalysis });
}
