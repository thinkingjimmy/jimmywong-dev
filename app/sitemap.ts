/**
 * [INPUT]: Site URL, Chinese/English home paths, and published article metadata.
 * [OUTPUT]: sitemap with home language alternates and public writing routes.
 * [POS]: Public route discovery for search engines.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { siteInfo } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latest = posts[0]?.date;

  return [
    {
      url: siteInfo.url,
      lastModified: latest,
      alternates: {
        languages: { "zh-CN": siteInfo.url, en: `${siteInfo.url}/en` },
      },
    },
    {
      url: `${siteInfo.url}/en`,
      lastModified: latest,
      alternates: {
        languages: { "zh-CN": siteInfo.url, en: `${siteInfo.url}/en` },
      },
    },
    {
      url: `${siteInfo.url}/writing`,
      lastModified: latest,
    },
    ...posts.map((post) => ({
      url: `${siteInfo.url}/writing/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
