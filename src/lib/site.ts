export const siteConfig = {
  name: "Dr. Niveen Salayi",
  shortName: "Dr Niveen",
  title:
    "Dr Niveen Salayi | Cosmetic & Restorative Dentist in Erbil, Iraq",
  description:
    "Dr Niveen Salayi is a cosmetic and restorative dentist in Erbil, Iraq. Co-founder of Restor Dental Clinic with 8 years of experience in smile design, bleaching, and restorative dentistry.",
  /** Public URL path on nordlyssolutions.com — SEO/canonical only, not Next.js routing. */
  canonicalPath: "/drniveen",
  origin: "https://nordlyssolutions.com",
  locale: "en_US",
  keywords: [
    "Dr Niveen",
    "Dr Niveen Salayi",
    "Niveen Salayi dentist",
    "cosmetic dentist Erbil",
    "restorative dentist Iraq",
    "Restor Dental Clinic",
    "dentist Erbil",
    "smile design Erbil",
  ],
  person: {
    givenName: "Niveen",
    familyName: "Salayi",
    honorificPrefix: "Dr",
    jobTitle: "Cosmetic and Restorative Dentist",
    alternateNames: ["Dr Niveen", "Dr. Niveen", "Niveen Salayi"],
  },
  clinic: {
    name: "Restor Dental Clinic",
    streetAddress: "Opposite of Zaga Mall",
    addressLocality: "Erbil",
    addressRegion: "Bakhtyari",
    addressCountry: "IQ",
    telephone: "+9647510514001",
    instagram: "https://instagram.com/restor.dental",
  },
  social: {
    instagram: "https://instagram.com/dr.niveen_salayi",
    whatsapp: "https://wa.me/9647510514001",
  },
  ogImage: "/images/about-left.jpg",
} as const;

export function getSiteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.origin}${siteConfig.canonicalPath}${normalizedPath === "/" ? "" : normalizedPath}`;
}
