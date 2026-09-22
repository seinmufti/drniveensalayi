"use client";

import { useSyncExternalStore } from "react";
import { DesktopPortfolioPage } from "./DesktopPortfolioPage";
import { DesktopShell } from "./DesktopShell";
import { PhoneShell } from "./PhoneShell";
import { PortfolioPage } from "./PortfolioPage";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerDesktopSnapshot() {
  return false;
}

export function ResponsiveSite() {
  const isDesktop = useSyncExternalStore(
    subscribe,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );

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
