import { markdownResponse } from "@/lib/markdown";
import { siteInfo, works } from "@/lib/site";

export function GET() {
  const content = `# About

${siteInfo.description}

你好，我是 Jimmy。

你可能没有听说过我，但或许几年前，你又阅读过我写的有关 Prompt Engineering 的[教程](https://github.com/thinkingjimmy/Learning-Prompt)。这几年 AI 发展迅猛，对 AI 的干预也从简单的 Prompt 进化到了 Harness。市面上也涌现了一大批相关的产品，但我却发现，对于有志于进入此领域的人（特别是非程序员）来说，缺少了一份简单易懂的教程。所以我又撰写了一份与 AI Agent（或者说 AI Coding）相关的教程。希望大家喜欢。

## Work

${works.map((work) => `- [${work.name}](${work.href}): ${work.description}`).join("\n")}

## Social

- [X](${siteInfo.x})
- [GitHub](${siteInfo.github})
- [Website](${siteInfo.url})
`;

  return markdownResponse(content);
}
