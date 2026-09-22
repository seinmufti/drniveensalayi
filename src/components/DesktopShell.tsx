"use client";

import { useEffect, type ReactNode } from "react";

type DesktopShellProps = {
  children: ReactNode;
};

export function DesktopShell({ children }: DesktopShellProps) {
  // Marks the body so portalled UI (the certificate lightbox) can be styled for
  // desktop without touching the phone layout.
  useEffect(() => {
    document.body.dataset.viewport = "desktop";
    return () => {
      delete document.body.dataset.viewport;
    };
  }, []);

  return <div className="desktop-root">{children}</div>;
}
