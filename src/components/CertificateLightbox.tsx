"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type CertificateLightboxImage = {
  src: string;
  alt: string;
  originRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

type CertificateLightboxProps = {
  image: CertificateLightboxImage | null;
  onClose: () => void;
};

const OPEN_MS = 460;
const CLOSE_MS = 380;
const OPEN_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const CLOSE_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

function getMotionDuration(openMs: number, closeMs: number, closing: boolean) {
  if (typeof window === "undefined") return closing ? closeMs : openMs;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : closing
      ? closeMs
      : openMs;
}

function getFlipTransform(
  from: DOMRectReadOnly,
  to: DOMRectReadOnly,
) {
  const fromCx = from.left + from.width / 2;
  const fromCy = from.top + from.height / 2;
  const toCx = to.left + to.width / 2;
  const toCy = to.top + to.height / 2;

  return {
    translateX: fromCx - toCx,
    translateY: fromCy - toCy,
    scaleX: from.width / Math.max(to.width, 1),
    scaleY: from.height / Math.max(to.height, 1),
  };
}

function transformToString(transform: {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
}) {
  return `translate3d(${transform.translateX}px, ${transform.translateY}px, 0) scale(${transform.scaleX}, ${transform.scaleY})`;
}

export function CertificateLightbox({
  image,
  onClose,
}: CertificateLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [displayImage, setDisplayImage] =
    useState<CertificateLightboxImage | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [backdropVisible, setBackdropVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (image) {
      setDisplayImage(image);
      setIsClosing(false);
      setBackdropVisible(false);
    }
  }, [image]);

  const finishClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDisplayImage(null);
    setIsClosing(false);
    setBackdropVisible(false);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (!displayImage || isClosing) return;
    setIsClosing(true);
    setBackdropVisible(false);

    const duration = getMotionDuration(OPEN_MS, CLOSE_MS, true);
    if (duration === 0) {
      finishClose();
      return;
    }

    closeTimerRef.current = window.setTimeout(finishClose, duration);
  }, [displayImage, finishClose, isClosing]);

  useEffect(() => {
    if (!displayImage || isClosing) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [displayImage, handleClose, isClosing]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || !displayImage) return;

    const duration = getMotionDuration(OPEN_MS, CLOSE_MS, isClosing);
    const easing = isClosing ? CLOSE_EASING : OPEN_EASING;
    const origin = new DOMRect(
      displayImage.originRect.left,
      displayImage.originRect.top,
      displayImage.originRect.width,
      displayImage.originRect.height,
    );
    const target = panel.getBoundingClientRect();
    const flip = getFlipTransform(origin, target);

    panel.style.willChange = "transform";

    if (duration === 0) {
      panel.style.transition = "none";
      panel.style.transform = isClosing
        ? transformToString(flip)
        : "translate3d(0, 0, 0) scale(1, 1)";
      if (!isClosing) setBackdropVisible(true);
      return;
    }

    if (isClosing) {
      panel.style.transition = `transform ${duration}ms ${easing}`;
      panel.style.transform = transformToString(flip);
      return;
    }

    panel.style.transition = "none";
    panel.style.transform = transformToString(flip);
    panel.getBoundingClientRect();

    requestAnimationFrame(() => {
      panel.style.transition = `transform ${duration}ms ${easing}`;
      panel.style.transform = "translate3d(0, 0, 0) scale(1, 1)";
      setBackdropVisible(true);
    });
  }, [displayImage, isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!mounted || !displayImage) return null;

  const backdropDuration = getMotionDuration(OPEN_MS, CLOSE_MS, isClosing);

  return createPortal(
    <div
      className="certificate-lightbox fixed inset-0 z-[10000] flex touch-none items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={displayImage.alt}
    >
      <button
        type="button"
        className={`certificate-lightbox-backdrop absolute inset-0 bg-black/75 ${
          backdropVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition:
            backdropDuration === 0
              ? "none"
              : `opacity ${backdropDuration}ms ${isClosing ? CLOSE_EASING : OPEN_EASING}`,
        }}
        aria-label="Close certificate preview"
        onClick={handleClose}
      />

      <div
        ref={panelRef}
        className="certificate-lightbox-panel relative z-[1] w-full max-w-[min(92vw,420px)]"
      >
        <button
          type="button"
          className="absolute -right-1 -top-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label="Close"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="certificate-lightbox-image relative aspect-[840/588] w-full max-h-[85svh] overflow-hidden rounded-lg bg-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <Image
            src={displayImage.src}
            alt={displayImage.alt}
            fill
            sizes="(max-width: 440px) 92vw, 420px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
