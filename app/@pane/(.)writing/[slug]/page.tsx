/**
 * [INPUT]: Async route parameters, post metadata, Suspense, and WritingArticle.
 * [OUTPUT]: InterceptedWritingArticle, generateMetadata, and generateStaticParams.
 * [POS]: Parallel article slot that retains the underlying site route during soft navigation.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { WritingArticle } from "@/components/writing-article";
import { getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

export default function InterceptedWritingArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-40" />}>
      <InterceptedArticle params={params} />
    </Suspense>
  );
}

async function InterceptedArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WritingArticle slug={slug} />;
}
