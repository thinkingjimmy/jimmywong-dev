/**
 * [INPUT]: Route segments, post metadata, article panes, site components, and scroll controls.
 * [OUTPUT]: WritingShell for writing index, direct article, and intercepted route layouts.
 * [POS]: Writing route content inside ArticleStage; preserves standalone article navigation.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { ArticlePane, useCloseArticle } from "@/components/article-pane";
import { OverlayScrollbar, ScrollArea, useHorizontalWheel } from "@/components/overlay-scrollbar";
import { SiteColumn } from "@/components/site-column";
import { SiteHeader } from "@/components/site-header";
import { WritingList } from "@/components/writing-list";
import type { PostMeta } from "@/lib/posts";

export function WritingShell({ posts, children }: { posts: PostMeta[]; children: ReactNode }) {
  const slug = useSelectedLayoutSegment();
  const intercepted = useSelectedLayoutSegment("pane");
  const [directSlug] = useState(slug);
  const close = useCloseArticle();
  const direct = slug != null && slug === directSlug;
  const rowRef = useRef<HTMLDivElement>(null);
  useHorizontalWheel(rowRef, direct);

  if (intercepted || !slug) {
    return (
      <SiteColumn>
        <SiteHeader />
        {children}
      </SiteColumn>
    );
  }

  if (!direct) {
    return (
      <>
        <SiteColumn>
          <SiteHeader />
          <WritingList posts={posts} />
        </SiteColumn>
        <ArticlePane key={slug} motion="enter" placement="overlay" onClose={close}>
          {children}
        </ArticlePane>
      </>
    );
  }

  return (
    <div
      ref={rowRef}
      id="writing-direct-row"
      className="writing-scroller pane-scroll relative flex min-h-dvh flex-col overflow-x-clip md:fixed md:inset-0 md:h-auto md:min-h-0 md:flex-row md:overflow-x-auto md:overflow-y-hidden md:overscroll-x-contain"
    >
      <section className="relative hidden w-[36rem] max-w-full shrink-0 md:flex md:h-full">
        <ScrollArea
          id="writing-list-scroll"
          className="h-full w-full"
          viewportClassName="flex flex-col gap-6 px-4 py-10"
        >
          <SiteHeader />
          <WritingList posts={posts} />
        </ScrollArea>
      </section>
      <ArticlePane key={slug} motion="none" placement="inline" onClose={close}>
        {children}
      </ArticlePane>
      <OverlayScrollbar orientation="horizontal" scrollerRef={rowRef} controls="writing-direct-row" />
    </div>
  );
}
