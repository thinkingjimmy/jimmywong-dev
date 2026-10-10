export const siteInfo = {
  name: "Jimmy",
  description: "一名懂点产品设计，又懂点代码的产品经理。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jimmywong-dev.vercel.app",
  username: "thinkingjimmy",
  x: "https://x.com/thinkingjimmy",
  github: "https://github.com/thinkingjimmy",
} as const;

export const works = [
  {
    name: "Comflowy",
    href: "https://github.com/6174/comflowy",
    description: "ComfyUI 与 Stable Diffusion 工作流工具",
    icon: "/works/comflowy.png",
  },
  {
    name: "Image Prompt Book",
    href: "https://github.com/thinkingjimmy/Image-Prompt-Book",
    description: "精选图像生成提示词库",
    icon: "/works/image-prompt-book.png",
  },
  {
    name: "Goalloom",
    href: "https://github.com/thinkingjimmy/goalloom",
    description: "按五个时间跨度组织的目标待办",
    icon: "/works/goalloom.png",
  },
] as const;
