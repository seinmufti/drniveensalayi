"use client";

import type { ReactNode } from "react";

type DesktopShellProps = {
  children: ReactNode;
};

export function DesktopShell({ children }: DesktopShellProps) {
  return <div className="desktop-site min-h-screen bg-[#1a1614]">{children}</div>;
}
