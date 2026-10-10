import type { Metadata } from "next";
import { WritingList } from "@/components/writing-list";
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
  return <WritingList posts={getPosts()} />;
}
