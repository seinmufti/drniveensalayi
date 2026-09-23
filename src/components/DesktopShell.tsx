"use client";

import type { ReactNode } from "react";

type DesktopShellProps = {
  children: ReactNode;
};

export function DesktopShell({ children }: DesktopShellProps) {
  return <div className="desktop-root">{children}</div>;
}
