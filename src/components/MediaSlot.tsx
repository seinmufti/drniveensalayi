"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type MediaSlotProps = {
  children: ReactNode;
  className?: string;
};

export function MediaSlot({ children, className = "" }: MediaSlotProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function MediaSkeleton({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="media-skeleton pointer-events-none absolute inset-0 z-0"
    />
  );
}

export function MediaImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "440px",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const markLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    setLoaded(false);
    const fallback = window.setTimeout(() => setLoaded(true), 1200);
    return () => window.clearTimeout(fallback);
  }, [src]);

  return (
    <div className="absolute inset-0">
      <MediaSkeleton visible={!loaded} />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading="eager"
        sizes={sizes}
        onLoad={markLoaded}
        className={`absolute inset-0 z-[1] object-cover ${className}`}
      />
    </div>
  );
}

function setupVideo(video: HTMLVideoElement, { loop = true }: { loop?: boolean } = {}) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = loop;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
}

export function MediaVideo({
  src,
  poster,
  className = "",
  priority = false,
  fill = false,
  pingPong = false,
}: {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  pingPong?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<"forward" | "reverse">("forward");
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    setShowSkeleton(true);

    const video = videoRef.current;
    if (!video) {
      const t = window.setTimeout(() => setShowSkeleton(false), 1200);
      return () => window.clearTimeout(t);
    }

    directionRef.current = "forward";
    setupVideo(video, { loop: !pingPong });

    const hideSkeleton = () => setShowSkeleton(false);

    const play = () => {
      setupVideo(video, { loop: !pingPong });
      video.playbackRate = directionRef.current === "reverse" ? -1 : 1;
      void video.play().catch(() => {});
    };

    const playReverse = () => {
      directionRef.current = "reverse";
      video.playbackRate = -1;
      video.currentTime = Math.max(0, video.duration - 0.05);
      void video.play().catch(() => {});
    };

    const handleEnded = () => {
      if (!pingPong) return;
      playReverse();
    };

    const handleTimeUpdate = () => {
      if (!pingPong || directionRef.current !== "reverse") return;
      if (video.currentTime <= 0.05) {
        directionRef.current = "forward";
        video.playbackRate = 1;
        video.currentTime = 0;
        void video.play().catch(() => {});
      }
    };

    video.addEventListener("loadeddata", hideSkeleton);
    video.addEventListener("playing", hideSkeleton);
    video.addEventListener("canplay", play);
    if (pingPong) {
      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    play();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else if (!video.paused) video.pause();
      },
      { threshold: 0.1 },
    );

    observer.observe(video);

    const fallback = window.setTimeout(hideSkeleton, 1200);

    const unlock = () => play();
    document.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("click", unlock);

    return () => {
      video.removeEventListener("loadeddata", hideSkeleton);
      video.removeEventListener("playing", hideSkeleton);
      video.removeEventListener("canplay", play);
      if (pingPong) {
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
      observer.disconnect();
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      window.clearTimeout(fallback);
    };
  }, [src, pingPong]);

  const wrapperClass = fill
    ? "pointer-events-none relative size-full"
    : "pointer-events-none absolute inset-0";
  const videoClass = fill
    ? "video-cover pointer-events-none size-full object-cover"
    : "video-cover pointer-events-none absolute inset-0 z-[1] size-full object-cover";

  return (
    <div className={wrapperClass}>
      <MediaSkeleton visible={showSkeleton} />
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop={!pingPong}
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster={poster}
        width={720}
        height={1280}
        className={`${videoClass} ${className}`}
      />
    </div>
  );
}
