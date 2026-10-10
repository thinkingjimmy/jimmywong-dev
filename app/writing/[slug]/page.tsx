import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import { mdxComponents } from "@/components/mdx";
import { formatPostDate } from "@/lib/format-date";
import { jsonLdIds } from "@/lib/json-ld";
import { getPost, getPosts } from "@/lib/posts";
import { siteInfo } from "@/lib/site";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.summary,
    alternates: {
      canonical: `/writing/${post.meta.slug}`,
      types: {
        "text/markdown": `/writing/${post.meta.slug}.md`,
      },
    },
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.summary,
      publishedTime: post.meta.date,
      url: `/writing/${post.meta.slug}`,
    },
  };
}

export default function WritingPostPage(props: PageProps<"/writing/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <Article {...props} />
    </Suspense>
  );
}

async function Article(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.summary,
    datePublished: post.meta.date,
    url: `${siteInfo.url}/writing/${post.meta.slug}`,
    author: { "@id": jsonLdIds.person },
    inLanguage: "zh-CN",
  };

  return (
    <article className="flex flex-col gap-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl leading-7 font-medium">{post.meta.title}</h2>
      <time dateTime={post.meta.date} className="text-sm leading-6 text-muted-foreground">
        {formatPostDate(post.meta.date)}
      </time>
      <div className="prose-copy text-sm/6">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
