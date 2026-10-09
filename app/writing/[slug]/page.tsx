import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";
import { mdxComponents } from "@/components/mdx";
import { formatPostDate } from "@/lib/format-date";
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

  return (
    <article className="flex flex-col gap-4">
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
