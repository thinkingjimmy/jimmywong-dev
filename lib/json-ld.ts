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
        inLanguage: "zh-CN",
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
