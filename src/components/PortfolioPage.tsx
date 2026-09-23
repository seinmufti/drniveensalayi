"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CertificateLightbox,
  type CertificateLightboxImage,
} from "./CertificateLightbox";
import { ClinicMap } from "./ClinicMap";
import { MediaImage, MediaSlot, MediaVideo } from "./MediaSlot";
import { SiteChrome, scrollToSection } from "./MobileNav";
import { SectionLabel } from "./SectionLabel";

export function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [certificateLightbox, setCertificateLightbox] =
    useState<CertificateLightboxImage | null>(null);

  const navLinks = [
    { label: "Meet Niveen", href: "#about" },
    { label: "Achievements", href: "#achievements" },
    { label: "Case Studies", href: "#cases" },
    { label: "Restor", href: "#restor" },
    { label: "Find Me", href: "#find-me" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="relative">
      <CertificateLightbox
        image={certificateLightbox}
        onClose={() => setCertificateLightbox(null)}
      />
      <SiteChrome
        open={menuOpen}
        onToggle={() => setMenuOpen((open) => !open)}
        onClose={() => setMenuOpen(false)}
        onHome={() => {
          setMenuOpen(false);
          scrollToSection("#home");
        }}
        onNavigate={(href) => {
          setMenuOpen(false);
          window.requestAnimationFrame(() => scrollToSection(href));
        }}
        links={navLinks}
      />

      <section
        id="home"
        className="section-screen hero-screen pointer-events-none relative overflow-hidden"
      >
        <div className="absolute inset-0 size-full">
          <MediaVideo
            src="/videos/hero-reel.mp4"
            poster="/images/hero-reel.jpg"
            priority
            fill
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <div className="hero-content relative z-10 flex h-full min-h-0 flex-col justify-end px-6">
          <div className="space-y-3">
            <h1 className="font-display text-[clamp(1.875rem,8svw,2.375rem)] leading-[1.1] text-white">
              Dr. Niveen Salayi
            </h1>
            <p className="font-body text-[clamp(0.8125rem,3.2svw,0.9375rem)] font-normal tracking-[0.08em] text-white/85">
              (BDS, GP) Cosmetics and Restorative Dentist
            </p>
            <p className="font-display text-[clamp(1rem,4.5svw,1.3125rem)] italic leading-snug text-white/90">
              &ldquo;Dentistry, with a touch of personality.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="section-screen bg-cream px-0 py-4 md:py-8">
        <SectionLabel>01 / Meet Niveen</SectionLabel>

        <div className="about-media grid min-h-0 w-full flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)] gap-0 px-0">
          <MediaSlot className="h-full min-h-0 w-full">
            <MediaImage
              src="/images/about-left.jpg"
              alt="Dr. Niveen portrait"
              className="object-[22%_45%]"
            />
          </MediaSlot>
          <MediaSlot className="h-full min-h-0 w-full">
            <MediaVideo
              src="/videos/about-right.mp4"
              poster="/images/about-right.jpg"
            />
          </MediaSlot>
        </div>

        <div className="section-copy shrink-0 space-y-3 px-3 pb-4 pt-4 md:space-y-5 md:pb-6 md:pt-6">
          <h2 className="font-display text-[clamp(1.5rem,5svw,1.8125rem)] font-semibold leading-tight text-text">
            Who says dentists are scary?
          </h2>
          <p className="px-3 font-body text-[clamp(0.8125rem,3.6svw,0.9375rem)] leading-[1.65] text-text-body">
            When I&apos;m not perfecting
            smiles, you&apos;ll find me exploring new cities, hunting for the
            best coffee spots, and proving that your dentist can actually be
            someone you look forward to seeing and connect with.
          </p>
        </div>
      </section>

      <section id="achievements" className="section-screen bg-cream px-0 py-4 md:py-8">
        <SectionLabel>02 / Academic Achievements</SectionLabel>

        <MediaSlot className="achievements-media relative min-h-0 w-full flex-1">
          <MediaImage
            src="/images/academic.jpg"
            alt="Dr. Niveen graduation"
          />
          <button
            type="button"
            className="absolute left-0 top-[19%] z-[3] w-[47.5%] max-w-[209px] cursor-pointer border-0 bg-transparent p-0 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label="View BAIRD cosmetic dentistry diploma"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setCertificateLightbox({
                src: "/images/diploma.jpg",
                alt: "BAIRD Professional Diploma in Clinical Cosmetic and Restorative Dentistry",
                originRect: {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                },
              });
            }}
          >
            <MediaSlot className="aspect-[512/341] w-full shadow-lg">
              <MediaImage
                src="/images/diploma.jpg"
                alt="BAIRD Professional Diploma in Clinical Cosmetic and Restorative Dentistry"
                sizes="209px"
              />
            </MediaSlot>
          </button>
          <button
            type="button"
            className="absolute right-0 top-[19%] z-[3] w-[47.5%] max-w-[209px] cursor-pointer border-0 bg-transparent p-0 text-left transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label="View BDS certificate"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setCertificateLightbox({
                src: "/images/bds-certificate.png",
                alt: "BDS certificate",
                originRect: {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                },
              });
            }}
          >
            <MediaSlot className="aspect-[512/341] w-full shadow-lg">
              <MediaImage
                src="/images/bds-certificate.png"
                alt="BDS certificate"
                sizes="209px"
              />
            </MediaSlot>
          </button>
        </MediaSlot>

        <div className="section-copy shrink-0 space-y-3 px-3 pb-4 pt-4 md:space-y-5 md:pb-6 md:pt-6">
          <h2 className="font-display text-[clamp(1.5rem,5svw,1.8125rem)] font-semibold leading-tight text-text-dark">
            Memorable smiles start with trust.
          </h2>
          <p className="px-3 font-body text-[clamp(0.8125rem,3.6svw,0.9375rem)] leading-[1.65] text-text-warm">
            With 8 years of experience in cosmetic and restorative dentistry,
            and a BAIRD professional Diploma In Cosmetic and Restorative
            Dentistry. I blend clinical precision with an artist&apos;s eye.
          </p>
        </div>
      </section>

      <section id="cases" className="section-screen bg-cream px-0 py-4 md:py-8">
        <SectionLabel>03 case studies</SectionLabel>

        <div className="cases-body min-h-0 flex-1">
          <article className="cases-article">
            <div className="case-media-row">
              <div className="case-media-gutter" aria-hidden="true" />
              <MediaSlot className="case-media h-full min-h-0 w-full">
                <MediaImage
                  src="/images/case-emax.jpg"
                  alt="Emax ceramic overlay case"
                />
              </MediaSlot>
              <div className="case-media-gutter" aria-hidden="true" />
            </div>
            <p className="mt-2 shrink-0 px-6 font-body text-[clamp(0.6875rem,3svw,0.8125rem)] leading-[1.55] text-text-body md:mt-3">
              Amalgam dental cavity replacement with Emax ceramic overlay -
              preserving tooth structure while restoring a naturally seamless
              finish.
            </p>
          </article>

          <article className="cases-article">
            <div className="case-media-row">
              <div className="case-media-gutter" aria-hidden="true" />
              <MediaSlot className="case-media h-full min-h-0 w-full">
                <MediaImage
                  src="/images/case-bleaching.jpg"
                  alt="Professional bleaching case"
                />
              </MediaSlot>
              <div className="case-media-gutter" aria-hidden="true" />
            </div>
            <p className="mt-2 shrink-0 px-6 font-body text-[clamp(0.6875rem,3svw,0.8125rem)] leading-[1.55] text-text-body md:mt-3">
              Professional bleaching treatment to remove deep cigarette stains -
              revealing a brighter, cleaner smile hidden underneath years of
              discolouration.
            </p>
          </article>
        </div>
      </section>

      <section id="restor" className="section-screen bg-cream px-0 pt-4 pb-0 md:pt-8">
        <SectionLabel>05 / Restor</SectionLabel>

        <div className="restor-media relative min-h-0 w-full flex-1 overflow-hidden">
          <MediaVideo
            src="/videos/vision.mp4"
            poster="/images/vision.jpg"
            fill
            className="object-[50%_90%]"
          />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="section-copy restor-copy absolute inset-x-0 bottom-0 z-[3] bg-black/10 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] backdrop-blur-none md:pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="space-y-3 px-6 md:space-y-4">
              <h2 className="font-display text-[clamp(1.5rem,5svw,1.8125rem)] font-semibold leading-tight text-white">
                From vision to reality.
              </h2>
              <p className="font-body text-[clamp(0.8125rem,3.6svw,0.9375rem)] leading-[1.65] text-white/90">
                Co-founder of Restor Dental Clinic
              </p>
              <p className="font-body text-[clamp(0.8125rem,3.6svw,0.9375rem)] leading-[1.65] text-white/90">
                Building a dental clinic from the ground up was never easy — but
                every detail of Restor was shaped by a dream to create something
                truly aesthetically unique..
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="find-me" className="section-screen bg-cream px-0 pt-4 pb-0 md:pt-8">
        <SectionLabel>06 / Where to Find Me</SectionLabel>

        <div className="find-me-media min-h-0 w-full flex-1">
          <div className="find-me-video relative min-h-0">
            <div className="find-me-video-frame relative h-full max-w-full">
              <MediaVideo
                src="/videos/find-me.mp4"
                poster="/images/find-me.jpg"
                fill
                className="!object-cover"
              />
            </div>
          </div>

          <div className="find-me-location px-9 pb-4 md:pb-6">
            <ClinicMap className="h-[min(150px,19svh)] rounded-xl shadow-md md:h-[160px]" />
            <p className="px-2 pt-2 text-center font-body text-[clamp(0.8125rem,3.6svw,0.9375rem)] leading-[1.55] text-text">
              Erbil — Bakhtyari — Opposite of Zaga Mall
              <br />— Restor Dental Clinic
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="section-screen relative overflow-hidden bg-cream">
        <div className="contact-layout relative z-10 min-h-0 flex-1">
          <div className="contact-content px-6 text-center text-white">
            <div className="contact-media absolute inset-0 overflow-hidden">
              <MediaVideo
                src="/videos/contact.mp4?v=3754"
                poster="/images/contact.jpg"
                fill
                priority
                className="object-[50%_28%]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/45 to-black/25" />

            <div className="contact-content-inner relative z-[2] flex min-h-0 flex-1 flex-col justify-end">
            <h2 className="font-display text-[clamp(2rem,8svw,2.375rem)] leading-tight">
              I&apos;ll be expecting you
            </h2>
            <div className="mx-auto mt-6 max-w-[360px] space-y-2.5 font-body text-[15px] leading-[1.7] text-white/95">
              <p>
                <a
                  href="https://wa.me/9647510514001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-4"
                >
                  WhatsApp: +964 751 051 4001
                </a>
              </p>
              <p>
                <a
                  href="https://instagram.com/dr.niveen_salayi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-4"
                >
                  Instagram: dr.niveen_salayi
                </a>
              </p>
              <p>
                <a
                  href="https://www.facebook.com/p/DrNiveen-salayi-61575858906904/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-4"
                >
                  Facebook: Dr. Niveen Salayi
                </a>
              </p>
              <p>
                <a
                  href="https://instagram.com/restor.dental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-4"
                >
                  Clinic Instagram: restor.dental
                </a>
              </p>
            </div>
            </div>
          </div>

          <footer className="contact-footer bg-[#161311]">
            <button
              type="button"
              onClick={() => scrollToSection("#home")}
              aria-label="Go to home"
              className="contact-footer-brand cursor-pointer border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-80"
            >
              <span className="font-logo text-[26px] font-semibold leading-none tracking-[0.02em] text-white">
                niveen
              </span>
            </button>

            <p className="contact-footer-copy font-body text-[11px] leading-[1.45] text-white/70">
              © 2026 Dr. Niveen Salayi
              <br />
              All rights reserved
            </p>

            <a
              href="https://nordlyssolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-footer-credit transition-opacity hover:opacity-80"
            >
              <p className="font-body text-[11px] leading-none text-white/70">
                Developed by
              </p>
              <div className="flex items-center justify-end gap-1.5">
                <Image
                  src="/images/nordlys-logo.png"
                  alt="Nordlys"
                  width={20}
                  height={21}
                  className="h-5 w-auto shrink-0"
                  style={{ width: "auto" }}
                />
                <span className="font-body text-[13px] leading-none text-white">
                  Nordlys
                </span>
              </div>
            </a>
          </footer>
        </div>
      </section>
    </div>
  );
}
