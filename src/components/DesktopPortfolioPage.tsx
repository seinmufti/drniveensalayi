"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import {
  CertificateLightbox,
  type CertificateLightboxImage,
} from "./CertificateLightbox";
import { ClinicMap } from "./ClinicMap";
import { MediaImage, MediaSlot, MediaVideo } from "./MediaSlot";

const NAV_LINKS = [
  { label: "Meet Niveen", href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Case Studies", href: "#cases" },
  { label: "Restor", href: "#restor" },
  { label: "Find Me", href: "#find-me" },
  { label: "Contact", href: "#contact" },
] as const;

function scrollToDesktopSection(href: string) {
  const id = href.replace(/^#/, "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Source clips are portrait phone videos. Stretching them across a desktop
// section upscales them ~2x, so the sharp copy is capped near its native width
// and a blurred poster fills the rest of the bleed.
const MAX_UPSCALE = 1.1;

function DesktopVideoStage({
  src,
  poster,
  nativeWidth,
  align,
  priority = false,
  objectPosition = "",
}: {
  src: string;
  poster: string;
  nativeWidth: number;
  align: "left" | "center" | "right";
  priority?: boolean;
  objectPosition?: string;
}) {
  const paneStyle = {
    "--stage-w": `${Math.round(nativeWidth * MAX_UPSCALE)}px`,
  } as CSSProperties;

  return (
    <div className="desktop-stage">
      <div
        aria-hidden
        className="desktop-stage-backdrop"
        style={{ backgroundImage: `url("${poster}")` }}
      />
      <div className={`desktop-stage-pane desktop-stage-${align}`} style={paneStyle}>
        <MediaVideo
          src={src}
          poster={poster}
          fill
          priority={priority}
          className={objectPosition}
        />
      </div>
    </div>
  );
}

function DesktopLabel({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <div className={`desktop-label${light ? " desktop-label-light" : ""}`}>
      <span>{children}</span>
      <span className="desktop-label-rule" aria-hidden />
    </div>
  );
}

function CertificateCard({
  src,
  alt,
  label,
  aspectClassName = "aspect-[200/147]",
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  aspectClassName?: string;
  onOpen: (image: CertificateLightboxImage) => void;
}) {
  return (
    <button
      type="button"
      className="desktop-cert"
      aria-label={label}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onOpen({
          src,
          alt,
          originRect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        });
      }}
    >
      <MediaSlot className={`${aspectClassName} w-full shadow-lg`}>
        <MediaImage
          src={src}
          alt={alt}
          sizes="220px"
          className="desktop-cert-photo"
        />
      </MediaSlot>
    </button>
  );
}

export function DesktopPortfolioPage() {
  const [activeHref, setActiveHref] = useState("#home");
  const [certificateLightbox, setCertificateLightbox] =
    useState<CertificateLightboxImage | null>(null);

  useEffect(() => {
    const root = document.querySelector(".desktop-scroll");
    if (!(root instanceof HTMLElement)) return;

    const sections = root.querySelectorAll<HTMLElement>("[data-desktop-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute("id");
        if (id) setActiveHref(`#${id}`);
      },
      { root, threshold: [0.55, 0.75] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const overHero = activeHref === "#home";

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    scrollToDesktopSection(href);
  };

  return (
    <>
      <CertificateLightbox
        image={certificateLightbox}
        onClose={() => setCertificateLightbox(null)}
      />

      <header className={`desktop-header ${overHero ? "is-over-hero" : "is-solid"}`}>
        <button
          type="button"
          className="desktop-logo"
          aria-label="Go to home"
          onClick={() => scrollToDesktopSection("#home")}
        >
          niveen
        </button>
        <nav className="desktop-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeHref === link.href ? "page" : undefined}
              onClick={(event) => handleNavigate(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="desktop-scroll">
        <section id="home" data-desktop-section className="desktop-section desktop-hero">
          <div className="desktop-hero-veil" aria-hidden />
          <div className="desktop-hero-copy">
            <div className="desktop-hero-intro">
              <h1>Dr. Niveen Salayi</h1>
              <p className="desktop-kicker">(BDS, GP) Cosmetics and Restorative Dentist</p>
              <p className="desktop-quote">&ldquo;Dentistry, with a touch of personality.&rdquo;</p>
            </div>
          </div>
          <div className="desktop-hero-media">
            <MediaVideo
              src="/videos/hero-reel.mp4"
              poster="/images/hero-reel.jpg"
              priority
              fill
            />
          </div>
        </section>

        <section
          id="about"
          data-desktop-section
          className="desktop-section desktop-section-cream"
        >
          <div className="desktop-section-inner">
            <DesktopLabel>01 / Meet Niveen</DesktopLabel>
            <div className="desktop-split">
              <div className="desktop-copy">
                <h2>Who says dentists are scary?</h2>
                <p>
                  When I&apos;m not perfecting smiles, you&apos;ll find me exploring new
                  cities, hunting for the best coffee spots, and proving that your
                  dentist can actually be someone you look forward to seeing and
                  connect with.
                </p>
              </div>
              <div className="desktop-about-media">
                <MediaSlot className="desktop-media-fill">
                  <MediaImage
                    src="/images/about-left.jpg"
                    alt="Dr. Niveen portrait"
                    className="object-[22%_45%]"
                    sizes="36vw"
                  />
                </MediaSlot>
                <MediaSlot className="desktop-media-fill">
                  <MediaVideo
                    src="/videos/about-right.mp4"
                    poster="/images/about-right.jpg"
                  />
                </MediaSlot>
              </div>
            </div>
          </div>
        </section>

        <section
          id="achievements"
          data-desktop-section
          className="desktop-section desktop-section-cream desktop-achievements"
        >
          <div className="desktop-achievements-copy">
            <DesktopLabel>02 / Academic Achievements</DesktopLabel>
            <div className="desktop-copy">
              <h2>Memorable smiles start with trust.</h2>
              <p>
                With 8 years of experience in cosmetic and restorative dentistry,
                and a BAIRD professional Diploma In Cosmetic and Restorative
                Dentistry. I blend clinical precision with an artist&apos;s eye.
              </p>
            </div>
          </div>
          <div className="desktop-achievements-media">
            <div className="desktop-achievements-stage">
              <MediaSlot className="desktop-media-fill">
                <MediaImage
                  src="/images/academic.jpg"
                  alt="Dr. Niveen graduation"
                  sizes="50vw"
                  className="desktop-achievements-photo"
                />
              </MediaSlot>
              <div className="desktop-certs">
                <CertificateCard
                  src="/images/diploma.jpg"
                  alt="BAIRD Professional Diploma in Clinical Cosmetic and Restorative Dentistry"
                  label="View BAIRD cosmetic dentistry diploma"
                  aspectClassName="aspect-[512/341]"
                  onOpen={setCertificateLightbox}
                />
                <CertificateCard
                  src="/images/bds-certificate.png"
                  alt="BDS certificate"
                  label="View BDS certificate"
                  onOpen={setCertificateLightbox}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="cases"
          data-desktop-section
          className="desktop-section desktop-section-cream"
        >
          <div className="desktop-section-inner">
            <DesktopLabel>03 case studies</DesktopLabel>
            <div className="desktop-cases">
              <article className="desktop-case">
                <div className="desktop-case-media-row">
                  <div className="desktop-case-gutter" aria-hidden="true" />
                  <div className="desktop-case-media">
                    <MediaSlot className="desktop-media-fill">
                      <MediaImage
                        src="/images/case-emax.jpg"
                        alt="Emax ceramic overlay case"
                        sizes="28vw"
                        className="desktop-case-photo"
                      />
                    </MediaSlot>
                  </div>
                  <div className="desktop-case-gutter" aria-hidden="true" />
                </div>
                <p>
                  Amalgam dental cavity replacement with Emax ceramic overlay -
                  preserving tooth structure while restoring a naturally seamless
                  finish.
                </p>
              </article>
              <article className="desktop-case">
                <div className="desktop-case-media-row">
                  <div className="desktop-case-gutter" aria-hidden="true" />
                  <div className="desktop-case-media">
                    <MediaSlot className="desktop-media-fill">
                      <MediaImage
                        src="/images/case-bleaching.jpg"
                        alt="Professional bleaching case"
                        sizes="28vw"
                        className="desktop-case-photo"
                      />
                    </MediaSlot>
                  </div>
                  <div className="desktop-case-gutter" aria-hidden="true" />
                </div>
                <p>
                  Professional bleaching treatment to remove deep cigarette stains -
                  revealing a brighter, cleaner smile hidden underneath years of
                  discolouration.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="restor" data-desktop-section className="desktop-section">
          <DesktopVideoStage
            src="/videos/vision.mp4"
            poster="/images/vision.jpg"
            nativeWidth={720}
            align="right"
            objectPosition="object-[50%_60%]"
          />
          <div className="desktop-bleed-shade" />
          <div className="desktop-bleed-copy">
            <DesktopLabel light>05 / Restor</DesktopLabel>
            <div className="desktop-bleed-body">
              <p className="desktop-role">Co-founder of Restor Dental Clinic</p>
              <h2>From vision to reality.</h2>
              <p className="desktop-body">
                Building a dental clinic from the ground up was never easy — but every
                detail of Restor was shaped by a dream to create something truly
                aesthetically unique..
              </p>
            </div>
          </div>
        </section>

        <section
          id="find-me"
          data-desktop-section
          className="desktop-section desktop-section-cream"
        >
          <div className="desktop-section-inner">
            <DesktopLabel>06 / Where to Find Me</DesktopLabel>
            <div className="desktop-find-layout">
              <div className="desktop-find-video">
                <div className="desktop-find-frame">
                  <MediaVideo
                    src="/videos/find-me.mp4"
                    poster="/images/find-me.jpg"
                    fill
                  />
                </div>
              </div>
              <div className="desktop-find-copy">
                <h2>Restor Dental Clinic</h2>
                <p>
                  Erbil — Bakhtyari — Opposite of Zaga Mall
                </p>
                <ClinicMap className="desktop-map" />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" data-desktop-section className="desktop-section desktop-contact">
          <div className="desktop-contact-media">
            <div className="desktop-contact-gutter desktop-contact-gutter-left">
              <div
                aria-hidden
                className="desktop-contact-gutter-bg"
                style={{ backgroundImage: 'url("/images/contact.jpg")' }}
              />
              <h2>I&apos;ll be expecting you</h2>
            </div>
            <div className="desktop-contact-frame">
              <MediaVideo
                src="/videos/contact.mp4?v=3754"
                poster="/images/contact.jpg"
                fill
                priority
                className="object-[50%_28%]"
              />
            </div>
            <div className="desktop-contact-gutter desktop-contact-gutter-right">
              <div
                aria-hidden
                className="desktop-contact-gutter-bg"
                style={{ backgroundImage: 'url("/images/contact.jpg")' }}
              />
              <div className="desktop-contact-links">
                <a
                  href="https://wa.me/9647510514001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="desktop-contact-link-row"
                >
                  <span className="desktop-contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <span className="desktop-contact-link-label">+964 751 051 4001</span>
                </a>
                <a
                  href="https://instagram.com/dr.niveen_salayi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="desktop-contact-link-row"
                >
                  <span className="desktop-contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <defs>
                        <linearGradient
                          id="contact-insta-gradient-personal"
                          x1="0%"
                          y1="100%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#FD5949" />
                          <stop offset="50%" stopColor="#D6249F" />
                          <stop offset="100%" stopColor="#285AEB" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#contact-insta-gradient-personal)"
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      />
                    </svg>
                  </span>
                  <span className="desktop-contact-link-label">dr.niveen_salayi</span>
                </a>
                <a
                  href="https://instagram.com/restor.dental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="desktop-contact-link-row"
                >
                  <span className="desktop-contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <defs>
                        <linearGradient
                          id="contact-insta-gradient-clinic"
                          x1="0%"
                          y1="100%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#FD5949" />
                          <stop offset="50%" stopColor="#D6249F" />
                          <stop offset="100%" stopColor="#285AEB" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#contact-insta-gradient-clinic)"
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      />
                    </svg>
                  </span>
                  <span className="desktop-contact-link-label">restor.dental</span>
                </a>
              </div>
            </div>
          </div>
          <footer className="desktop-footer">
            <button
              type="button"
              className="desktop-footer-brand"
              aria-label="Go to home"
              onClick={() => scrollToDesktopSection("#home")}
            >
              niveen
            </button>
            <p>
              © 2026 Dr. Niveen Salayi
              <br />
              All rights reserved
            </p>
            <a
              href="https://nordlyssolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="desktop-footer-credit"
            >
              Developed by
              <span>
                <Image
                  src="/images/nordlys-logo.png"
                  alt="Nordlys"
                  width={20}
                  height={21}
                  className="h-5 w-auto shrink-0"
                />
                Nordlys
              </span>
            </a>
          </footer>
        </section>
      </div>
    </>
  );
}
