import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

const writingDirectory = path.join(process.cwd(), "content/writing");

function asDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const match = /^(\d{4}-\d{2}-\d{2})/.exec(String(value ?? ""));
  return match?.[1] ?? "";
}

function readPost(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const filePath = path.join(writingDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    date: asDate(data.date),
    summary: String(data.summary ?? ""),
  };

  return { meta, content };
}

export function getPosts(): PostMeta[] {
  if (!fs.existsSync(writingDirectory)) return [];

  return fs
    .readdirSync(writingDirectory)
    .filter((name) => name.endsWith(".mdx"))
    .flatMap((name) => {
      const post = readPost(name.slice(0, -4));
      return post ? [post.meta] : [];
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return readPost(slug);
}
