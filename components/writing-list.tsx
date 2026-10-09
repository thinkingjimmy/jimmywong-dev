import Link from "next/link";
import { formatPostDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/posts";

export function WritingList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">还没有文章。</p>;
  }

  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/writing/${post.slug}`}
            className="flex items-baseline justify-between gap-6 py-1.5 text-sm leading-6"
          >
            <span className="link">{post.title}</span>
            <time dateTime={post.date} className="shrink-0 text-muted-foreground tabular-nums">
              {formatPostDate(post.date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
