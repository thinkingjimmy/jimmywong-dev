import Image from "next/image";
import Link from "next/link";
import { FollowLinks } from "@/components/follow-links";
import { GitHubGraph } from "@/components/github-graph";
import { SectionDivider, SectionLabel } from "@/components/section-divider";
import { WritingList } from "@/components/writing-list";
import { getPosts } from "@/lib/posts";
import { works } from "@/lib/site";

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <div className="prose-copy flex flex-col gap-4 text-sm/6">
        <p>一名懂点产品设计，又懂点代码的产品经理。</p>
        <p>
          你可能没有听说过我，但或许几年前，你又阅读过我写的有关 Prompt Engineering 的
          <a
            className="link"
            href="https://github.com/thinkingjimmy/Learning-Prompt"
            target="_blank"
            rel="noreferrer"
          >
            教程
          </a>
          。这几年 AI 发展迅猛，对 AI 的干预也从简单的 Prompt 进化到了 Harness。市面上也涌现了一大批相关的产品，但我却发现，对于有志于进入此领域的人（特别是非程序员）来说，缺少了一份简单易懂的教程。所以我又撰写了一份与 AI Agent（或者说 AI Coding）相关的教程。希望大家喜欢。
        </p>
      </div>

      <FollowLinks />

      <GitHubGraph />

      <SectionDivider />

      <section>
        <SectionLabel>Work</SectionLabel>
        <ul className="flex flex-col gap-3">
          {works.map((work) => (
            <li key={work.href}>
              <a
                href={work.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 text-sm leading-6 hover:opacity-70"
              >
                <Image
                  src={work.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="mt-0.5 size-5 shrink-0 rounded-[5px]"
                />
                <span>
                  <span className="font-medium">{work.name}</span>
                  <span className="text-muted-foreground"> / {work.description}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider />

      <section>
        <SectionLabel>Writing</SectionLabel>
        <WritingList posts={posts} />
        <Link href="/writing" className="link mt-3 w-fit text-sm leading-6">
          查看全部 →
        </Link>
      </section>
    </>
  );
}
