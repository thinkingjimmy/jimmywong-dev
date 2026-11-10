/**
 * [INPUT]: Shared site profile metadata and supported home languages.
 * [OUTPUT]: jsonLdIds and siteJsonLd for website/person structured data.
 * [POS]: Shared entity identifiers and schema used by the root layout and writing routes.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import { siteInfo } from "@/lib/site";

export const jsonLdIds = {
  website: `${siteInfo.url}/#website`,
  person: `${siteInfo.url}/#person`,
} as const;

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": jsonLdIds.website,
        name: siteInfo.name,
        url: siteInfo.url,
        description: siteInfo.description,
        inLanguage: ["zh-CN", "en"],
        author: { "@id": jsonLdIds.person },
      },
      {
        "@type": "Person",
        "@id": jsonLdIds.person,
        name: siteInfo.name,
        alternateName: siteInfo.username,
        identifier: siteInfo.username,
        description: siteInfo.description,
        url: siteInfo.url,
        image: `${siteInfo.url}/avatar.png`,
        sameAs: [siteInfo.github, siteInfo.x],
      },
    ],
  };
}
