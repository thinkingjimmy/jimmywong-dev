/**
 * [INPUT]: Writing route children, post metadata, and WritingShell.
 * [OUTPUT]: WritingLayout with direct and intercepted article support.
 * [POS]: Shared writing route layout inside the root ArticleStage.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { ReactNode } from "react";
import { WritingShell } from "@/components/writing-shell";
import { getPosts } from "@/lib/posts";

export default function WritingLayout({ children }: { children: ReactNode }) {
  return <WritingShell posts={getPosts()}>{children}</WritingShell>;
}
