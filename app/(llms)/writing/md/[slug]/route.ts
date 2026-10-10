import { markdownResponse } from "@/lib/markdown";
import { getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const post = getPost(slug.replace(/\.md$/, ""));
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const content = `# ${post.meta.title}

${post.meta.date}

${post.content.trim()}
`;

  return markdownResponse(content);
}
