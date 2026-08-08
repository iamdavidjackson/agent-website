import { AgentChat } from "@/components/agent-chat";
import agentContent from "@/generated/agent-content.json";

type AgentPageProps = {
  searchParams: Promise<{ jobId?: string | string[] }>;
};

export default async function AgentPage({ searchParams }: AgentPageProps) {
  const value = (await searchParams).jobId;
  const jobId = typeof value === "string" ? value : undefined;
  const jobProfile = jobId
    ? (agentContent.jobProfiles as Record<
        string,
        { companyName: string; recruiterName: string }
      >)[jobId]
    : undefined;

  return <AgentChat jobId={jobId} jobProfile={jobProfile} />;
}
