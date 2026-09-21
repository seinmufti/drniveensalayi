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

function supportsReversePlayback(video: HTMLVideoElement) {
  try {
    const previous = video.playbackRate;
    video.playbackRate = -1;
    const supported = video.playbackRate < 0;
    video.playbackRate = previous;
    return supported;
  } catch {
    return false;
  }
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
  const reverseRafRef = useRef<number | null>(null);
  const reverseSupportedRef = useRef(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    setShowSkeleton(true);

    const video = videoRef.current;
    if (!video) {
      const t = window.setTimeout(() => setShowSkeleton(false), 1200);
      return () => window.clearTimeout(t);
    }

    directionRef.current = "forward";
    reverseSupportedRef.current = supportsReversePlayback(video);
    setupVideo(video, { loop: !pingPong });

    const hideSkeleton = () => setShowSkeleton(false);

    const stopManualReverse = () => {
      if (reverseRafRef.current !== null) {
        cancelAnimationFrame(reverseRafRef.current);
        reverseRafRef.current = null;
      }
    };

    const seekTo = (time: number) => {
      const nextTime = Math.max(0, time);
      if (typeof video.fastSeek === "function") {
        video.fastSeek(nextTime);
        return;
      }
      video.currentTime = nextTime;
    };

    const playForward = () => {
      stopManualReverse();
      directionRef.current = "forward";
      video.playbackRate = 1;
      if (video.currentTime <= 0.01) {
        seekTo(0);
      }
      void video.play().catch(() => {});
    };

    const playReverse = () => {
      if (reverseSupportedRef.current) {
        stopManualReverse();
        directionRef.current = "reverse";
        video.playbackRate = -1;
        if (video.currentTime >= video.duration - 0.05) {
          seekTo(Math.max(0, video.duration - 0.05));
        }
        void video.play().catch(() => {});
        return;
      }

      directionRef.current = "reverse";
      video.playbackRate = 1;
      video.pause();

      let lastTs = performance.now();

      const step = (now: number) => {
        const delta = Math.min(0.05, (now - lastTs) / 1000);
        lastTs = now;

        if (video.currentTime <= 0.01) {
          seekTo(0);
          playForward();
          return;
        }

        seekTo(video.currentTime - delta);
        reverseRafRef.current = requestAnimationFrame(step);
      };

      reverseRafRef.current = requestAnimationFrame(step);
    };

    const resumePlayback = () => {
      setupVideo(video, { loop: !pingPong });
      if (directionRef.current === "reverse") {
        playReverse();
        return;
      }

      stopManualReverse();
      video.playbackRate = 1;
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      if (!pingPong) return;
      playReverse();
    };

    const handleTimeUpdate = () => {
      if (!pingPong || directionRef.current !== "reverse") return;
      if (!reverseSupportedRef.current) return;
      if (video.currentTime <= 0.01) {
        playForward();
      }
    };

    const handleCanPlay = () => {
      resumePlayback();
      video.removeEventListener("canplay", handleCanPlay);
    };

    video.addEventListener("loadeddata", hideSkeleton);
    video.addEventListener("playing", hideSkeleton);
    video.addEventListener("canplay", handleCanPlay);
    if (pingPong) {
      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    resumePlayback();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          resumePlayback();
          return;
        }

        stopManualReverse();
        if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);

    const fallback = window.setTimeout(hideSkeleton, 1200);

    const unlock = () => {
      resumePlayback();
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("touchstart", unlock, { passive: true, once: true });
    document.addEventListener("click", unlock, { once: true });

    return () => {
      stopManualReverse();
      video.removeEventListener("loadeddata", hideSkeleton);
      video.removeEventListener("playing", hideSkeleton);
      video.removeEventListener("canplay", handleCanPlay);
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
