/**
 * [INPUT]: Localized profile copy, public project URLs, and local project icons.
 * [OUTPUT]: siteInfo and works with Chinese and English project descriptions.
 * [POS]: Shared profile and project data for the home pages and machine-readable routes.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import { homeCopy } from "@/lib/i18n/home";

export const siteInfo = {
  name: "Jimmy",
  description: homeCopy.zh.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jimmywong-dev.vercel.app",
  username: "thinkingjimmy",
  x: "https://x.com/thinkingjimmy",
  github: "https://github.com/thinkingjimmy",
  googleAnalyticsId: "G-V5EJ827DX1",
} as const;

export const works = [
  {
    name: "Comflowy",
    href: "https://github.com/6174/comflowy",
    description: {
      zh: "ComfyUI 与 Stable Diffusion 工作流工具",
      en: "A workflow tool for ComfyUI and Stable Diffusion",
    },
    icon: "/works/comflowy.png",
  },
  {
    name: "Image Prompt Book",
    href: "https://github.com/thinkingjimmy/Image-Prompt-Book",
    description: {
      zh: "精选图像生成提示词库",
      en: "A curated collection of image generation prompts",
    },
    icon: "/works/image-prompt-book.png",
  },
  {
    name: "Goalloom",
    href: "https://github.com/thinkingjimmy/goalloom",
    description: {
      zh: "按五个时间跨度组织的目标待办",
      en: "Goals and tasks organized across five time horizons",
    },
    icon: "/works/goalloom.png",
  },
  {
    name: "Vibe Coding Nav",
    href: "https://www.vibecodingnav.com/",
    description: {
      zh: "按编程场景选择 AI 模型与工具",
      en: "AI models and tools for every coding task",
    },
    icon: "/works/vibe-coding-nav.svg",
  },
] as const;
