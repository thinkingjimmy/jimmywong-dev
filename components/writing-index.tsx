/**
 * [INPUT]: Post metadata and the shared WritingList component.
 * [OUTPUT]: WritingIndex with a focusable heading and the full article list.
 * [POS]: Shared content for the writing index route and its horizontal pane.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import { WritingList } from "@/components/writing-list";
import type { PostMeta } from "@/lib/posts";

export function WritingIndex({ posts }: { posts: PostMeta[] }) {
  return (
    <section aria-labelledby="writing-index-heading" className="flex flex-col gap-4">
      <h2 id="writing-index-heading" tabIndex={-1} className="text-xl leading-7 font-medium outline-none">
        Writing
      </h2>
      <WritingList posts={posts} />
    </section>
  );
}
