"use client";

import dynamic from "next/dynamic";

const ResponsiveSite = dynamic(
  () => import("./ResponsiveSite").then((mod) => mod.ResponsiveSite),
  { ssr: false },
);

export function HomeClient() {
  return <ResponsiveSite />;
}
