/**
 * [INPUT]: Async route parameters, post metadata, Suspense, and WritingArticle.
 * [OUTPUT]: WritingPostPage, generateMetadata, and generateStaticParams.
 * [POS]: Direct article route; WritingShell handles its viewport and close navigation.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { WritingArticle } from "@/components/writing-article";
import { getPost, getPosts } from "@/lib/posts";

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
  return <WritingArticle slug={slug} />;
}
