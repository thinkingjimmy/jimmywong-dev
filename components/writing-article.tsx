/**
 * [INPUT]: Post content, MDX mappings, embed transforms, dates, and site metadata.
 * [OUTPUT]: Async WritingArticle with article markup, focusable title, and JSON-LD.
 * [POS]: Shared server article renderer for ArticleStage and direct/intercepted writing routes.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArticleBody } from "@/components/article-body";
import { Authorship } from "@/components/authorship";
import { mdxComponents } from "@/components/mdx";
import { embedTweetLinks } from "@/lib/embed-tweets";
import { formatPostDate } from "@/lib/format-date";
import { jsonLdIds } from "@/lib/json-ld";
import { getPost } from "@/lib/posts";
import { siteInfo } from "@/lib/site";

export async function WritingArticle({ slug }: { slug: string }) {
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
      <h2
        id={`writing-article-${slug}`}
        tabIndex={-1}
        className="text-xl leading-7 font-medium outline-none"
      >
        {post.meta.title}
      </h2>
      <div className="flex items-center gap-3">
        <time dateTime={post.meta.date} className="shrink-0 text-sm leading-6 text-muted-foreground">
          {formatPostDate(post.meta.date)}
        </time>
        {post.meta.human != null ? (
          <div className="min-w-0 flex-1">
            <Authorship human={post.meta.human} />
          </div>
        ) : null}
      </div>
      <ArticleBody>
        <MDXRemote source={embedTweetLinks(post.content)} components={mdxComponents} />
      </ArticleBody>
    </article>
  );
}
