import { markdownResponse } from "@/lib/markdown";
import { getPosts } from "@/lib/posts";
import { siteInfo } from "@/lib/site";

export function GET() {
  const posts = getPosts();
  const content = `# ${siteInfo.name}

> ${siteInfo.description}

个人主页。下面的链接返回 Markdown，去掉 \`.md\` 就是对应的网页。

- [About](${siteInfo.url}/about.md): 介绍、作品和联系方式。
- [Writing](${siteInfo.url}/writing.md): 全部文章，按时间从新到旧。

## Writing

${posts
  .map(
    (post) =>
      `- [${post.title}](${siteInfo.url}/writing/${post.slug}.md) (${post.date}): ${post.summary}`,
  )
  .join("\n")}
`;

  return markdownResponse(content);
}
