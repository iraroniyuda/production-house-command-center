import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AuthenticationBoundary } from "@/components/auth/authentication-boundary";
import { ApplicationShell } from "@/components/workspace/application-shell";

export const metadata: Metadata = {
  title: "Workspace | Production House Command Center",
  description:
    "Authenticated workspace for Production House Command Center.",
};

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthenticationBoundary>
      <ApplicationShell>{children}</ApplicationShell>
    </AuthenticationBoundary>
  );
}
