"use client";

import { useLayoutEffect, useState } from "react";
import { DesktopPortfolioPage } from "./DesktopPortfolioPage";
import { DesktopShell } from "./DesktopShell";
import { PhoneShell } from "./PhoneShell";
import { PortfolioPage } from "./PortfolioPage";

const DESKTOP_QUERY = "(min-width: 768px)";

export function ResponsiveSite() {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mediaQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (isDesktop) {
    return (
      <DesktopShell>
        <DesktopPortfolioPage />
      </DesktopShell>
    );
  }

  return (
    <PhoneShell>
      <PortfolioPage />
    </PhoneShell>
  );
}
