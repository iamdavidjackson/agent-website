type WorkflowInstanceStatus = {
  status: string;
  error?: { name: string; message: string };
  output?: unknown;
};

type CareerWorkflowBinding = {
  create(options: {
    id: string;
    params: import("./lib/types").ApplicationInput & { applicationId: string };
  }): Promise<{ id: string; status(): Promise<WorkflowInstanceStatus> }>;
  get(id: string): Promise<{
    status(): Promise<WorkflowInstanceStatus>;
    sendEvent(event: { type: string; payload: unknown }): Promise<void>;
  }>;
};

interface CloudflareEnv {
  DB: D1Database;
  ARTIFACTS: R2Bucket;
  CAREER_WORKFLOW: CareerWorkflowBinding;
  BROWSER: BrowserRun;
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  AGENT_BASE_URL?: string;
  CAREER_STUDIO_ACCESS_EMAIL?: string;
  CAREER_STUDIO_LOCAL_DEV?: string;
}
