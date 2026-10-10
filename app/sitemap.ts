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
