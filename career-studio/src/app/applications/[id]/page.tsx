import { ApplicationWorkspace } from "@/components/application-workspace";

type PageProps = { params: Promise<{ id: string }> };

export default async function ApplicationPage({ params }: PageProps) {
  const { id } = await params;
  return <ApplicationWorkspace applicationId={id} />;
}
