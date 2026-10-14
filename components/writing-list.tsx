/**
 * [INPUT]: Post metadata, current pathname, and ArticleStage's writing pane context.
 * [OUTPUT]: WritingList and WritingIndexLink with pointer and keyboard pane navigation.
 * [POS]: Article and index entry points shared by the home column and writing layouts.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWritingStack, writingLinkClick } from "@/components/article-stage";
import { formatPostDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/posts";

export function WritingList({ posts }: { posts: PostMeta[] }) {
  const pathname = usePathname();
  const stack = useWritingStack();
  const routeSlug = /^\/writing\/([^/]+)$/.exec(pathname)?.[1];
  const hardArticle = routeSlug != null && (stack?.paths.length ?? 0) === 0;

  if (posts.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">还没有文章。</p>;
  }

  return (
    <ul className="flex flex-col">
      {posts.map((post) => {
        const href = `/writing/${post.slug}`;
        const opened = stack?.paths.includes(href) ?? false;
        const current = opened ? stack?.paths.at(-1) === href : hardArticle && post.slug === routeSlug;

        return (
          <li key={post.slug}>
            <Link
              href={href}
              aria-current={current ? "page" : undefined}
              data-current={current || opened ? "true" : undefined}
              onClick={(event) => {
                if (hardArticle) return;
                writingLinkClick(event, href, stack?.open);
              }}
              className="flex items-baseline justify-between gap-6 py-1.5 text-sm leading-6 hover:opacity-70 data-[current=true]:font-medium"
            >
              <span className="font-medium">{post.title}</span>
              <time dateTime={post.date} className="shrink-0 text-muted-foreground tabular-nums">
                {formatPostDate(post.date)}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function WritingIndexLink() {
  const stack = useWritingStack();

  return (
    <Link
      href="/writing"
      onClick={(event) => writingLinkClick(event, "/writing", stack?.open)}
      className="link shrink-0 whitespace-nowrap text-sm leading-6"
    >
      查看全部 →
    </Link>
  );
}
