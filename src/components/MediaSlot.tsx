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
    const previousRate = video.playbackRate;
    video.playbackRate = -1;
    const supported = video.playbackRate < 0;
    video.playbackRate = previousRate;
    return supported;
  } catch {
    return false;
  }
}

function setPlaybackRate(video: HTMLVideoElement, rate: number) {
  try {
    video.playbackRate = rate;
    return video.playbackRate === rate;
  } catch {
    return false;
  }
}

export function MediaVideo({
  src,
  reverseSrc,
  poster,
  className = "",
  priority = false,
  fill = false,
  pingPong = false,
}: {
  src: string;
  reverseSrc?: string;
  poster: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  pingPong?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);
  const directionRef = useRef<"forward" | "reverse">("forward");
  const pingPongActiveRef = useRef(false);
  const useDualClip = pingPong && !!reverseSrc;
  const [activeClip, setActiveClip] = useState<"forward" | "reverse">("forward");
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    setShowSkeleton(true);

    if (useDualClip) {
      const forward = forwardRef.current;
      const reverse = reverseRef.current;
      if (!forward || !reverse) {
        const t = window.setTimeout(() => setShowSkeleton(false), 1200);
        return () => window.clearTimeout(t);
      }

      directionRef.current = "forward";
      setupVideo(forward, { loop: false });
      setupVideo(reverse, { loop: false });
      forward.preload = "auto";
      reverse.preload = "auto";

      const hideSkeleton = () => setShowSkeleton(false);

      let preRollTarget: "forward" | "reverse" | null = null;

      const showClip = (next: "forward" | "reverse") => {
        directionRef.current = next;
        setActiveClip(next);
      };

      const seekToStart = (clip: HTMLVideoElement) => {
        if (clip.currentTime <= 0.01) return;
        if (typeof clip.fastSeek === "function") {
          clip.fastSeek(0);
          return;
        }
        clip.currentTime = 0;
      };

      const beginPreRoll = (next: "forward" | "reverse") => {
        if (preRollTarget === next || directionRef.current === next) return;

        const nextClip = next === "forward" ? forward : reverse;
        preRollTarget = next;
        seekToStart(nextClip);
        void nextClip.play().catch(() => {});
      };

      const handoffToClip = (next: "forward" | "reverse") => {
        const outgoing = next === "forward" ? reverse : forward;
        const incoming = next === "forward" ? forward : reverse;

        preRollTarget = null;
        showClip(next);

        if (incoming.paused) {
          seekToStart(incoming);
          void incoming.play().catch(() => {});
        }

        outgoing.pause();
        seekToStart(outgoing);
      };

      const resumePlayback = () => {
        const active = directionRef.current === "reverse" ? reverse : forward;
        if (active.paused) {
          void active.play().catch(() => {});
        }
      };

      const handleForwardEnded = () => handoffToClip("reverse");
      const handleReverseEnded = () => handoffToClip("forward");

      const handleForwardTimeUpdate = () => {
        if (directionRef.current !== "forward") return;
        const remaining = forward.duration - forward.currentTime;
        if (Number.isFinite(remaining) && remaining <= 0.15) {
          beginPreRoll("reverse");
        }
      };

      const handleReverseTimeUpdate = () => {
        if (directionRef.current !== "reverse") return;
        const remaining = reverse.duration - reverse.currentTime;
        if (Number.isFinite(remaining) && remaining <= 0.15) {
          beginPreRoll("forward");
        }
      };

      forward.addEventListener("loadeddata", hideSkeleton);
      forward.addEventListener("playing", hideSkeleton);
      forward.addEventListener("ended", handleForwardEnded);
      forward.addEventListener("timeupdate", handleForwardTimeUpdate);
      reverse.addEventListener("ended", handleReverseEnded);
      reverse.addEventListener("timeupdate", handleReverseTimeUpdate);

      reverse.load();
      handoffToClip("forward");

      const observerTarget = forward.closest("section") ?? forward;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            resumePlayback();
            return;
          }

          forward.pause();
          reverse.pause();
        },
        { threshold: 0.35 },
      );

      observer.observe(observerTarget);

      const fallback = window.setTimeout(hideSkeleton, 1200);
      const unlock = () => resumePlayback();
      document.addEventListener("touchstart", unlock, { passive: true, once: true });
      document.addEventListener("click", unlock, { once: true });

      return () => {
        forward.removeEventListener("loadeddata", hideSkeleton);
        forward.removeEventListener("playing", hideSkeleton);
        forward.removeEventListener("ended", handleForwardEnded);
        forward.removeEventListener("timeupdate", handleForwardTimeUpdate);
        reverse.removeEventListener("ended", handleReverseEnded);
        reverse.removeEventListener("timeupdate", handleReverseTimeUpdate);
        observer.disconnect();
        document.removeEventListener("touchstart", unlock);
        document.removeEventListener("click", unlock);
        window.clearTimeout(fallback);
      };
    }

    const video = videoRef.current;
    if (!video) {
      const t = window.setTimeout(() => setShowSkeleton(false), 1200);
      return () => window.clearTimeout(t);
    }

    directionRef.current = "forward";
    pingPongActiveRef.current = pingPong && supportsReversePlayback(video);
    setupVideo(video, { loop: pingPong ? !pingPongActiveRef.current : true });

    const hideSkeleton = () => setShowSkeleton(false);

    const playForward = () => {
      directionRef.current = "forward";
      setPlaybackRate(video, 1);
      if (video.currentTime <= 0.01) {
        video.currentTime = 0;
      }
      void video.play().catch(() => {});
    };

    const playReverse = () => {
      directionRef.current = "reverse";
      if (!setPlaybackRate(video, -1)) {
        playForward();
        return;
      }

      if (video.currentTime >= video.duration - 0.05) {
        video.currentTime = Math.max(0, video.duration - 0.05);
      }

      void video.play().catch(() => {});
    };

    const resumePlayback = () => {
      setupVideo(video, { loop: pingPong ? !pingPongActiveRef.current : true });

      if (pingPongActiveRef.current && directionRef.current === "reverse") {
        playReverse();
        return;
      }

      setPlaybackRate(video, 1);
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      if (!pingPongActiveRef.current) return;
      playReverse();
    };

    const handleTimeUpdate = () => {
      if (!pingPongActiveRef.current || directionRef.current !== "reverse") return;
      if (video.currentTime <= 0.01) {
        playForward();
      }
    };

    const handleCanPlay = () => {
      resumePlayback();
    };

    video.addEventListener("loadeddata", hideSkeleton);
    video.addEventListener("playing", hideSkeleton);
    video.addEventListener("canplay", handleCanPlay);
    if (pingPongActiveRef.current) {
      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    resumePlayback();

    const observerTarget = video.closest("section") ?? video;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          resumePlayback();
          return;
        }

        if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(observerTarget);

    const fallback = window.setTimeout(hideSkeleton, 1200);

    const unlock = () => resumePlayback();
    document.addEventListener("touchstart", unlock, { passive: true, once: true });
    document.addEventListener("click", unlock, { once: true });

    return () => {
      video.removeEventListener("loadeddata", hideSkeleton);
      video.removeEventListener("playing", hideSkeleton);
      video.removeEventListener("canplay", handleCanPlay);
      if (pingPongActiveRef.current) {
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
      observer.disconnect();
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      window.clearTimeout(fallback);
    };
  }, [src, reverseSrc, pingPong, useDualClip]);

  const wrapperClass = fill
    ? "pointer-events-none relative size-full"
    : "pointer-events-none absolute inset-0";
  const videoClass = fill
    ? "video-cover pointer-events-none size-full object-cover"
    : "video-cover pointer-events-none absolute inset-0 size-full object-cover";

  const sharedVideoProps = {
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: useDualClip || priority ? "auto" : "metadata",
    poster,
    width: 720,
    height: 1280,
  } as const;

  if (useDualClip) {
    const dualClipVideoProps = {
      autoPlay: true,
      muted: true,
      playsInline: true,
      preload: "auto" as const,
      width: 720,
      height: 1280,
    };

    return (
      <div className={wrapperClass}>
        <MediaSkeleton visible={showSkeleton} />
        <video
          ref={forwardRef}
          src={src}
          loop={false}
          {...dualClipVideoProps}
          className={`${videoClass} ${className} ${activeClip === "forward" ? "z-[1] opacity-100" : "z-0 opacity-0"}`}
        />
        <video
          ref={reverseRef}
          src={reverseSrc}
          loop={false}
          {...dualClipVideoProps}
          className={`${videoClass} ${className} ${activeClip === "reverse" ? "z-[1] opacity-100" : "z-0 opacity-0"}`}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <MediaSkeleton visible={showSkeleton} />
      <video
        ref={videoRef}
        src={src}
        loop={!pingPong}
        {...sharedVideoProps}
        className={`${videoClass} z-[1] ${className}`}
      />
    </div>
  );
}
