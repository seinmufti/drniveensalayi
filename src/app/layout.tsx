import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Dancing_Script,
  Instrument_Sans,
} from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ViewportInitScript } from "@/components/ViewportInitScript";
import "./globals.css";
import "./desktop.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Niveen Salayi",
  description:
    "Cosmetics and Restorative Dentist — Dentistry, with a touch of personality.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${instrument.variable} ${dancing.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ViewportInitScript />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <ViewportInitScript />
        {children}
      </body>
    </html>
  );
}
