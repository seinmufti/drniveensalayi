"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

type NavLink = {
  label: string;
  href: string;
};

type SiteChromeProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onHome: () => void;
  onNavigate: (href: string) => void;
  links: NavLink[];
};

function getScrollContainer(): HTMLElement | null {
  const scrollEl = document.querySelector(".phone-scroll");
  if (!(scrollEl instanceof HTMLElement)) return null;

  const overflowY = getComputedStyle(scrollEl).overflowY;
  const canScroll = scrollEl.scrollHeight > scrollEl.clientHeight + 1;

  if ((overflowY === "auto" || overflowY === "scroll") && canScroll) {
    return scrollEl;
  }

  return null;
}

function getHeaderOffset() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-h")
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 66;
}

export function scrollToSection(href: string) {
  const id = href.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return;

  const scrollContainer = getScrollContainer();
  if (scrollContainer) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const top =
    window.scrollY + target.getBoundingClientRect().top - getHeaderOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function SiteChromeInner({
  open,
  onToggle,
  onClose,
  onHome,
  onNavigate,
  links,
}: SiteChromeProps) {
  const handleNavigate = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();
      onNavigate(href);
    },
    [onNavigate],
  );

  return (
    <div className="site-chrome">
      {open ? (
        <div className="mobile-nav-overlay" aria-hidden={!open}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-[#2f241f]/95 backdrop-blur-md"
          />

          <div className="relative flex h-full flex-col px-8 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))]">
            <nav className="flex flex-col gap-7">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavigate(event, link.href)}
                  className="font-display text-[clamp(1.75rem,8svw,2rem)] leading-none text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <p className="mt-auto font-mono text-[11px] uppercase tracking-[0.08em] text-white/50">
              Dr. Niveen Salayi
            </p>
          </div>
        </div>
      ) : null}

      <header
        className={`site-header flex shrink-0 items-center justify-between px-6 backdrop-blur-sm transition-colors duration-300 ${
          open ? "bg-transparent" : "bg-cream/80"
        }`}
      >
        <button
          type="button"
          onClick={onHome}
          aria-label="Go to home"
          className={`font-logo cursor-pointer text-[28px] font-semibold leading-none tracking-[0.02em] transition-colors duration-300 ${
            open ? "text-white" : "text-[#2e1e1b]"
          }`}
        >
          niveen
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative flex h-12 w-12 flex-col items-end justify-center gap-[5px] cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent]"
        >
          <span
            className={`pointer-events-none block h-px w-[18px] origin-center transition-all duration-300 ${
              open ? "translate-y-[3px] rotate-45 bg-white" : "bg-[#2e1e1b]"
            }`}
          />
          <span
            className={`pointer-events-none block h-px transition-all duration-300 ${
              open
                ? "w-[18px] -translate-y-[2px] -rotate-45 bg-white"
                : "w-3 bg-[#2e1e1b]"
            }`}
          />
        </button>
      </header>
    </div>
  );
}

export function SiteChrome(props: SiteChromeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!props.open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [props.open, props.onClose]);

  if (!mounted) {
    return (
      <>
        <div aria-hidden className="site-header-spacer" />
        <SiteChromeInner {...props} />
      </>
    );
  }

  return (
    <>
      <div aria-hidden className="site-header-spacer" />
      {createPortal(<SiteChromeInner {...props} />, document.body)}
    </>
  );
}
