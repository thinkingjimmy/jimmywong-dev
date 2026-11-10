/**
 * [INPUT]: Chinese and English profile copy and public home route conventions.
 * [OUTPUT]: Locale and homeCopy for localized home content, metadata, and header controls.
 * [POS]: Shared home dictionary consumed by site metadata and the home/header components.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
export type Locale = "zh" | "en";

export const homeCopy = {
  zh: {
    path: "/",
    languageTag: "zh-CN",
    openGraphLocale: "zh_CN",
    greeting: "你好，我是 Jimmy 👋",
    description: "一名懂点产品设计，又懂点代码的产品经理。",
    introductionBeforeLink:
      "你可能没有听说过我，但或许你有阅读过我写的有关 Prompt Engineering 的",
    tutorialLabel: "教程（Learning Prompt）",
    introductionAfterLink:
      "。或者看过我写的有关 ComfyUI 的教程，以及用过 ComfyUI 的平替 Comflowy。",
    agentIntroduction:
      "随着 AI 的发展，AI 的使用也越来越普及。并且我发现越来越多人开始关注 AI Coding，但我却发现，对于有志于进入此领域的人（特别是非程序员）来说，缺少了一份简单易懂的教程。所以我又撰写了一份与 AI Agent（或者说 AI Coding）相关的教程。希望大家喜欢。",
    worksLabel: "My Works",
    switchLanguage: "Switch to English",
    lightTheme: "切换到浅色",
    darkTheme: "切换到深色",
    xiaohongshu: "小红书",
  },
  en: {
    path: "/en",
    languageTag: "en",
    openGraphLocale: "en_US",
    greeting: "Hi, I'm Jimmy 👋",
    description: "A product manager who also designs and codes.",
    introductionBeforeLink:
      "You may not know me, but you might have read my prompt engineering tutorial, ",
    tutorialLabel: "Learning Prompt",
    introductionAfterLink:
      ". Or perhaps you've read my ComfyUI tutorials or used Comflowy, an alternative to ComfyUI.",
    agentIntroduction:
      "As AI becomes more widely used, more people are exploring AI coding. But clear, accessible tutorials are still hard to find, especially for people who don't code. So I wrote another tutorial about AI agents and AI coding. I hope you find it useful.",
    worksLabel: "My Works",
    switchLanguage: "切换到中文",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    xiaohongshu: "Xiaohongshu",
  },
} as const;
