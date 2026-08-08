import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Agent for David Jackson",
  description:
    "A conversational portfolio assistant for David Jackson's background, experience, and job-specific application context.",
};

export default function AgentLayout({ children }: { children: ReactNode }) {
  return children;
}
