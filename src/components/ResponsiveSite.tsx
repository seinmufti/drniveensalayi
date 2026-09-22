"use client";

import { useLayoutEffect, useState } from "react";
import { DesktopPortfolioPage } from "./DesktopPortfolioPage";
import { DesktopShell } from "./DesktopShell";
import { PhoneShell } from "./PhoneShell";
import { PortfolioPage } from "./PortfolioPage";

const DESKTOP_QUERY = "(min-width: 768px)";

function readIsDesktop() {
  if (typeof window === "undefined") {
    return false;
  }

  const fromDom = document.documentElement.dataset.viewport;
  if (fromDom === "desktop") return true;
  if (fromDom === "mobile") return false;

  return window.matchMedia(DESKTOP_QUERY).matches;
}

function syncViewportMarker(isDesktop: boolean) {
  const viewport = isDesktop ? "desktop" : "mobile";
  document.documentElement.dataset.viewport = viewport;
  document.body.dataset.viewport = viewport;
}

export function ResponsiveSite() {
  const [isDesktop, setIsDesktop] = useState(readIsDesktop);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const update = () => {
      const desktop = mediaQuery.matches;
      syncViewportMarker(desktop);
      setIsDesktop(desktop);
    };

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
