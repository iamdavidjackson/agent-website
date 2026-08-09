import {
  cloudflareEnv,
  createApplication,
  listApplications,
  updateApplicationStage,
} from "@/lib/db";
import { applicationInputSchema } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const env = await cloudflareEnv();
    const applications = await listApplications(env);
    return Response.json({ applications });
  } catch (error) {
    console.error("Unable to list applications", error);
    return Response.json({ error: "Unable to load applications." }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = applicationInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Please check the application details.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const env = await cloudflareEnv();
  const id = crypto.randomUUID();
  await createApplication(env, id, parsed.data);

  try {
    const instance = await env.CAREER_WORKFLOW.create({
      id,
      params: { ...parsed.data, applicationId: id },
    });
    return Response.json(
      { id, workflowId: instance.id, status: await instance.status() },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start workflow";
    await updateApplicationStage(env, id, "errored", "startup", message);
    console.error("Unable to start career workflow", error);
    return Response.json(
      { error: "The application was saved, but its workflow could not start.", id },
      { status: 502 },
    );
  }
}
