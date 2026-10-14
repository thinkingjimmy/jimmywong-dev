/**
 * [INPUT]: Post metadata and the shared WritingIndex renderer.
 * [OUTPUT]: WritingPage and canonical writing index metadata.
 * [POS]: Direct writing index route; its content is also available in ArticleStage.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { Metadata } from "next";
import { WritingIndex } from "@/components/writing-index";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Jimmy 写过的文章。",
  alternates: {
    canonical: "/writing",
    types: {
      "text/markdown": "/writing.md",
    },
  },
};

export default function WritingPage() {
  return <WritingIndex posts={getPosts()} />;
}
