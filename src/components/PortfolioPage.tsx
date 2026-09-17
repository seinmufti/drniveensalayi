"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionLabel } from "./SectionLabel";

function MenuIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="flex h-7 w-7 flex-col items-end justify-center gap-[3px]"
    >
      <span className="block h-px w-[18px] bg-white" />
      <span className="block h-px w-3 bg-white" />
    </button>
  );
}

function MediaBackground({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={`object-cover ${className}`}
      sizes="440px"
    />
  );
}

function VideoBackground({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Meet Niveen", href: "#about" },
    { label: "Achievements", href: "#achievements" },
    { label: "Case Studies", href: "#cases" },
    { label: "Restor", href: "#restor" },
    { label: "Find Me", href: "#find-me" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#2f241f]/95 px-8 py-16 text-white backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute right-6 top-8 text-2xl leading-none text-white/80"
          >
            ×
          </button>
          <nav className="mt-12 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-[66px] items-center justify-between bg-cream px-6">
        <span className="font-logo text-[22px] text-[#2e1e1b]">niveen</span>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex flex-col items-end gap-[5px]"
        >
          <span className="block h-px w-[18px] bg-[#2e1e1b]" />
          <span className="block h-px w-3 bg-[#2e1e1b]" />
        </button>
      </header>

      <section className="relative min-h-[890px]">
        <div className="absolute inset-0">
          <VideoBackground
            src="/videos/hero-reel.mp4"
            poster="/images/hero-reel.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        </div>

        <div className="relative z-10 flex min-h-[890px] flex-col px-6 pb-12 pt-6">
          <div className="flex items-start justify-between">
            <MenuIcon onClick={() => setMenuOpen(true)} />
          </div>

          <div className="mt-auto space-y-3 pt-24">
            <h1 className="font-display text-[38px] leading-[1.1] text-white">
              Dr. Niveen Salayi
            </h1>
            <p className="font-display text-base tracking-[0.04em] text-white/95">
              (BDS, GP) Cosmetics and Restorative Dentist
            </p>
            <p className="font-display text-[21px] italic leading-snug text-white/90">
              &ldquo;Dentistry, with a touch of personality.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="bg-cream pb-14 pt-14">
        <SectionLabel>01 / Meet Niveen</SectionLabel>

        <div className="mt-8 grid h-[500px] grid-cols-2">
          <div className="relative">
            <MediaBackground src="/images/about-left.jpg" alt="Dr. Niveen portrait" />
          </div>
          <div className="relative">
            <VideoBackground
              src="/videos/about-right.mp4"
              poster="/images/about-right.jpg"
            />
          </div>
        </div>

        <div className="space-y-5 px-3 pt-8">
          <h2 className="font-display text-[29px] font-semibold leading-tight text-text">
            Dentistry, with a touch of personality.
          </h2>
          <p className="px-3 font-body text-[15px] leading-[1.65] text-text-body">
            Who said dentists have to be scary? When I&apos;m not perfecting
            smiles, you&apos;ll find me exploring new cities, hunting for the
            best coffee spots, and proving that your dentist can actually be
            someone you look forward to seeing and connect with.
          </p>
        </div>
      </section>

      <section id="achievements" className="bg-cream pb-14 pt-2">
        <SectionLabel>02 / Academic Achievements</SectionLabel>

        <div className="relative mt-6 h-[506px]">
          <MediaBackground
            src="/images/academic.jpg"
            alt="Dr. Niveen graduation"
          />
          <div className="absolute left-0 top-[97px] w-[209px] px-0">
            <div className="relative ml-0 aspect-[209/147] w-[209px] overflow-hidden shadow-lg">
              <Image
                src="/images/diploma.png"
                alt="Diploma certificate"
                fill
                className="object-cover"
                sizes="209px"
              />
            </div>
          </div>
          <div className="absolute right-0 top-[97px] w-[200px] pr-0">
            <div className="relative aspect-[200/147] w-[200px] overflow-hidden shadow-lg">
              <Image
                src="/images/bds-certificate.png"
                alt="BDS certificate"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 pt-8">
          <h2 className="font-display text-[29px] font-semibold leading-tight text-text-dark">
            Memorable smiles start with trust.
          </h2>
          <p className="font-body text-[15px] leading-[1.65] text-text-warm">
            With 8 years of experience in cosmetic and restorative dentistry,
            and a BAIRD professional Diploma In Cosmetic and Restorative
            Dentistry. I blend clinical precision with an artist&apos;s eye.
          </p>
          <p className="font-body text-[15px] leading-[1.65] text-text-warm">
            Let&apos;s design a smile that feels uniquely yours.
          </p>
        </div>
      </section>

      <section id="cases" className="bg-cream px-6 pb-14 pt-14">
        <SectionLabel className="px-0">03 case studies</SectionLabel>

        <div className="mt-10 space-y-6">
          <article>
            <div className="relative h-[280px] overflow-hidden">
              <MediaBackground
                src="/images/case-emax.jpg"
                alt="Emax ceramic overlay case"
              />
            </div>
            <p className="mt-3 font-body text-[13px] leading-[1.55] text-text-body">
              Amalgam dental cavity replacement with Emax ceramic overlay -
              preserving tooth structure while restoring a naturally seamless
              finish.
            </p>
          </article>

          <article>
            <div className="relative h-[280px] overflow-hidden">
              <MediaBackground
                src="/images/case-bleaching.jpg"
                alt="Professional bleaching case"
              />
            </div>
            <p className="mt-3 font-body text-[13px] leading-[1.55] text-text-body">
              Professional bleaching treatment to remove deep cigarette stains -
              revealing a brighter, cleaner smile hidden underneath years of
              discolouration.
            </p>
          </article>
        </div>
      </section>

      <section id="restor" className="bg-cream pb-14 pt-2">
        <SectionLabel>05 / Restor</SectionLabel>

        <div className="relative mt-6 h-[500px]">
          <VideoBackground
            src="/videos/vision.mp4"
            poster="/images/vision.jpg"
          />
        </div>

        <div className="space-y-4 px-6 pt-8">
          <h2 className="font-display text-[29px] font-semibold leading-tight text-text">
            From vision to reality.
          </h2>
          <p className="font-body text-[15px] leading-[1.65] text-text-body">
            Co-founder of Restor Dental Clinic — where artistry meets precision,
            and every smile tells a story.
          </p>
          <p className="font-body text-[15px] leading-[1.65] text-text-body">
            Building a dental clinic from the ground up was never easy — but
            every detail of Restor was shaped by a dream to create something
            truly aesthetically unique..
          </p>
        </div>
      </section>

      <section id="find-me" className="bg-cream pb-14 pt-2">
        <SectionLabel>06 / Where to Find Me</SectionLabel>

        <div className="relative mx-5 mt-6 aspect-[400/603] overflow-hidden">
          <VideoBackground
            src="/videos/find-me.mp4"
            poster="/images/find-me.jpg"
          />
        </div>

        <div className="relative mx-9 -mt-16 mb-4 h-[214px] overflow-hidden shadow-md">
          <Image
            src="/images/map.png"
            alt="Clinic location map"
            fill
            className="object-cover"
            sizes="367px"
          />
        </div>

        <p className="px-8 text-center font-body text-[15px] leading-[1.55] text-text">
          Erbil — Bakhtyari — Opposite of Zaga Mall
          <br />— Restor Dental Clinic
        </p>
      </section>

      <section id="contact" className="relative min-h-[877px]">
        <div className="absolute inset-0">
          <VideoBackground
            src="/videos/booking.mp4"
            poster="/images/booking.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
        </div>

        <div className="relative z-10 px-6 pt-14">
          <div className="h-px w-full bg-white/25" />
        </div>

        <div className="relative z-10 flex min-h-[700px] flex-col justify-end px-6 pb-16 pt-32 text-center text-white">
          <h2 className="font-display text-[38px] leading-tight">
            I&apos;ll be expecting you
          </h2>
          <div className="mx-auto mt-8 max-w-[360px] space-y-3 font-body text-[15px] leading-[1.7] text-white/95">
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
                href="https://instagram.com/restor.dental"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-4"
              >
                Clinic Instagram: restor.dental
              </a>
            </p>
            <p className="pt-2">
              Address:
              <br />
              Erbil — Bakhtyari — Opposite of Zaga Mall
            </p>
          </div>
        </div>
      </section>

      <footer className="flex min-h-[82px] items-center justify-between gap-3 bg-cream px-6 py-5">
        <span className="font-logo text-2xl text-[#2e1e1b]">niveen</span>
        <p className="max-w-[157px] text-center font-body text-[11px] leading-[1.45] text-text-body">
          © 2026 Dr. Niveen Salayi
          <br />
          All rights reserved
        </p>
        <div className="text-right">
          <p className="font-body text-[11px] text-text-body">Developed by</p>
          <div className="mt-1 flex items-center justify-end gap-1.5">
            <Image
              src="/images/nordlys-logo.png"
              alt="Nordlys"
              width={20}
              height={21}
            />
            <span className="font-body text-[13px] text-text-dark">Nordlys</span>
          </div>
        </div>
      </footer>
    </>
  );
}
