"use client";

import { useEffect, useState } from "react";

function playVisibleVideos() {
  document.querySelectorAll("video").forEach((el) => {
    if (!(el instanceof HTMLVideoElement)) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView || !el.src) return;

    el.muted = true;
    el.playsInline = true;
    void el.play().catch(() => {});
  });
}

export function VideoPlaybackInit() {
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.matchMedia("(max-width: 767px)").matches;

    const checkPlayback = () => {
      const hero = document.querySelector("video");
      if (!hero || !(hero instanceof HTMLVideoElement)) return;
      setNeedsTap(isMobile && hero.paused && hero.readyState >= 2);
    };

    playVisibleVideos();

    const timer = window.setTimeout(checkPlayback, 1200);

    const unlock = () => {
      playVisibleVideos();
      setNeedsTap(false);
    };

    document.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("click", unlock);
    document.addEventListener("visibilitychange", unlock);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("visibilitychange", unlock);
    };
  }, []);

  if (!needsTap) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-[80] flex justify-center px-6 md:hidden">
      <p className="rounded-full bg-black/75 px-4 py-2 font-body text-sm text-white backdrop-blur-sm">
        Tap anywhere to play videos
      </p>
    </div>
  );
}
