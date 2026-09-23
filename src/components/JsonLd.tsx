import { getSiteUrl, siteConfig } from "@/lib/site";

export function JsonLd() {
  const siteUrl = getSiteUrl();
  const imageUrl = getSiteUrl(siteConfig.ogImage);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: siteConfig.title,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
      {
        "@type": ["Person", "Physician"],
        "@id": `${siteUrl}/#person`,
        name: siteConfig.name,
        alternateName: siteConfig.person.alternateNames,
        givenName: siteConfig.person.givenName,
        familyName: siteConfig.person.familyName,
        honorificPrefix: siteConfig.person.honorificPrefix,
        jobTitle: siteConfig.person.jobTitle,
        description: siteConfig.description,
        url: siteUrl,
        image: imageUrl,
        sameAs: [siteConfig.social.instagram, siteConfig.clinic.instagram],
        worksFor: { "@id": `${siteUrl}/#clinic` },
        knowsAbout: [
          "Cosmetic dentistry",
          "Restorative dentistry",
          "Smile design",
          "Dental bleaching",
        ],
      },
      {
        "@type": "Dentist",
        "@id": `${siteUrl}/#clinic`,
        name: siteConfig.clinic.name,
        url: siteConfig.clinic.instagram,
        telephone: siteConfig.clinic.telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.clinic.streetAddress,
          addressLocality: siteConfig.clinic.addressLocality,
          addressRegion: siteConfig.clinic.addressRegion,
          addressCountry: siteConfig.clinic.addressCountry,
        },
        employee: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
