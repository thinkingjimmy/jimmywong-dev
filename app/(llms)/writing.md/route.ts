import { markdownResponse } from "@/lib/markdown";
import { getPosts } from "@/lib/posts";
import { siteInfo } from "@/lib/site";

export function GET() {
  const posts = getPosts();
  const content = `# Writing

> Jimmy 写过的文章。

每条链接都是这篇的 Markdown。去掉 \`.md\` 就是网页。

## All posts (${posts.length})

${posts
  .map(
    (post) =>
      `- [${post.title}](${siteInfo.url}/writing/${post.slug}.md) (${post.date}): ${post.summary}`,
  )
  .join("\n")}
`;

  return markdownResponse(content);
}
