import {
  cloudflareEnv,
  getApplication,
  updateApplicationStage,
} from "@/lib/db";
import { z } from "zod";

const approvalSchema = z.object({
  approved: z.boolean(),
  notes: z.string().trim().max(10_000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const parsed = approvalSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid review response." }, { status: 400 });
  }

  const { id } = await context.params;
  const env = await cloudflareEnv();
  const application = await getApplication(env, id);
  if (!application) {
    return Response.json({ error: "Application not found." }, { status: 404 });
  }
  if (application.stage !== "awaiting-review") {
    return Response.json(
      { error: "This application is not awaiting review." },
      { status: 409 },
    );
  }

  const instance = await env.CAREER_WORKFLOW.get(application.workflow_id);
  await instance.sendEvent({ type: "application-review", payload: parsed.data });
  await updateApplicationStage(
    env,
    id,
    "running",
    "review-submitted",
  );
  return Response.json({ ok: true, status: await instance.status() });
}
