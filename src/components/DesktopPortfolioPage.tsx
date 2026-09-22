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
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
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
      <MediaSlot className="aspect-[200/147] w-full shadow-lg">
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
            <h1>Dr. Niveen Salayi</h1>
            <p className="desktop-kicker">(BDS, GP) Cosmetics and Restorative Dentist</p>
            <p className="desktop-quote">&ldquo;Dentistry, with a touch of personality.&rdquo;</p>
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
                  src="/images/diploma.png"
                  alt="Diploma certificate"
                  label="View diploma certificate"
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
            <div
              aria-hidden
              className="desktop-contact-backdrop"
              style={{ backgroundImage: 'url("/images/contact.jpg")' }}
            />
            <div className="desktop-contact-frame">
              <MediaVideo
                src="/videos/contact.mp4?v=3754"
                poster="/images/contact.jpg"
                fill
                priority
                className="object-[50%_28%]"
              />
            </div>
            <div className="desktop-bleed-shade" aria-hidden />
            <div className="desktop-contact-copy">
              <h2>I&apos;ll be expecting you</h2>
              <div className="desktop-contact-links">
                <a href="https://wa.me/9647510514001" target="_blank" rel="noopener noreferrer">
                  WhatsApp: +964 751 051 4001
                </a>
                <a
                  href="https://instagram.com/dr.niveen_salayi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram: dr.niveen_salayi
                </a>
                <a
                  href="https://instagram.com/restor.dental"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Clinic Instagram: restor.dental
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
