/**
 * [INPUT]: An initialized CUA browser tab, preview URL, and optional screenshot sink.
 * [OUTPUT]: verifyHomeLanguage with repeatable locale, project, theme, keyboard, and layout evidence.
 * [POS]: Focused home verification; shares the CUA browser approach used by scripts/panes.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import assert from "node:assert/strict";

async function settleTheme(tab) {
  const deadline = Date.now() + 2000;
  do {
    const running = await tab.playwright.evaluate(() => !!document.querySelector(":active-view-transition"));
    if (!running) return;
    await tab.getScreenshot({ emit: false });
  } while (Date.now() < deadline);
  assert.fail("The theme transition must finish before capturing evidence.");
}

async function inspect(tab) {
  await tab.getAXState({ emit: false });
  return tab.playwright.evaluate(() => {
    const column = [...document.querySelectorAll("[data-site-column]")].find(
      (element) => element.getBoundingClientRect().height > 0,
    );
    const header = [...column.querySelectorAll("header")].find(
      (element) => element.getBoundingClientRect().height > 0,
    );
    const controls = [...header.querySelectorAll("button, a[hreflang]")].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        label: element.getAttribute("aria-label"),
        href: element.getAttribute("href"),
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
      };
    });
    const workLinks = [...column.querySelectorAll("section li a")].filter(
      (element) => element.getBoundingClientRect().height > 0,
    ).map((element) => {
      const image = element.querySelector("img");
      return {
        text: element.textContent,
        href: element.getAttribute("href"),
        target: element.getAttribute("target"),
        iconLoaded: !!image?.complete && image.naturalWidth > 0,
      };
    });
    return {
      path: location.pathname,
      language: document.documentElement.lang,
      dark: document.documentElement.classList.contains("dark"),
      heading: header.querySelector("h1").textContent,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => ({
        language: link.hreflang,
        path: new URL(link.href).pathname,
      })),
      openGraphLocale: document.querySelector('meta[property="og:locale"]')?.content,
      introduction: [...column.querySelectorAll(".prose-copy")].find(
        (element) => element.getBoundingClientRect().height > 0,
      ).textContent,
      controls,
      workLinks,
      viewport: innerWidth,
      pageWidth: document.documentElement.scrollWidth,
    };
  });
}

function verifyLayout(state) {
  assert.equal(state.controls.length, 2);
  for (const control of state.controls) {
    assert.ok(control.width >= 44 && control.height >= 44, "Header controls need 44px hit areas.");
  }
  const [theme, language] = state.controls;
  assert.ok(theme.x + theme.width <= language.x + 1, "Header controls must not overlap.");
  assert.ok(Math.abs(theme.y - language.y) < 1, "Header controls must share one row.");
  assert.ok(state.pageWidth <= state.viewport, "The page must fit the viewport.");
  assert.equal(state.workLinks.length, 4);
  assert.ok(state.workLinks.every((work) => work.iconLoaded), "Every project icon must load.");
  const project = state.workLinks.find((work) => work.href === "https://www.vibecodingnav.com/");
  assert.ok(project?.text.includes("Vibe Coding Nav"));
  assert.equal(project.target, "_blank");
  assert.ok(state.alternates.some((link) => link.language === "zh-CN" && link.path === "/"));
  assert.ok(state.alternates.some((link) => link.language === "en" && link.path === "/en"));
}

export async function verifyHomeLanguage(tab, { baseUrl = "http://localhost:3000", capture } = {}) {
  const report = {};
  if (await tab.url() === `${baseUrl}/`) await tab.reload();
  else await tab.goto(`${baseUrl}/`);
  report.chinese = await inspect(tab);
  verifyLayout(report.chinese);
  assert.equal(report.chinese.language, "zh-CN");
  assert.equal(report.chinese.heading, "你好，我是 Jimmy 👋");
  assert.ok(report.chinese.introduction.includes("或者看过我写的有关 ComfyUI 的教程"));
  assert.ok(report.chinese.workLinks.at(-1).text.includes("按编程场景选择 AI 模型与工具"));
  if (capture) await capture("home-zh", await tab.screenshot({ fullPage: true }));

  await tab.playwright.getByRole("button", { name: report.chinese.dark ? "切换到浅色" : "切换到深色", exact: true }).click();
  await tab.getAXState({ emit: false });
  await settleTheme(tab);
  const changedTheme = await inspect(tab);
  assert.notEqual(changedTheme.dark, report.chinese.dark);

  await tab.playwright.getByRole("link", { name: "Switch to English", exact: true }).press("Enter");
  await tab.playwright.getByRole("heading", { name: "Hi, I'm Jimmy 👋", exact: true }).waitFor({ state: "visible" });
  report.english = await inspect(tab);
  verifyLayout(report.english);
  assert.equal(report.english.path, "/en");
  assert.equal(report.english.language, "en");
  assert.equal(report.english.dark, changedTheme.dark);
  assert.ok(report.english.description.includes("product manager"));
  assert.ok(report.english.canonical.endsWith("/en"));
  assert.equal(report.english.openGraphLocale, "en_US");
  assert.ok(!/[\u3400-\u9fff]/u.test(report.english.introduction));
  assert.ok(report.english.workLinks.every((work) => !/[\u3400-\u9fff]/u.test(work.text)));
  assert.ok(report.english.controls[0].label.startsWith("Switch to "));
  if (capture) await capture("home-en", await tab.screenshot({ fullPage: true }));

  await tab.reload();
  report.reloaded = await inspect(tab);
  assert.equal(report.reloaded.path, "/en");
  assert.equal(report.reloaded.language, "en");
  assert.equal(report.reloaded.dark, changedTheme.dark);

  await tab.back();
  report.back = await inspect(tab);
  assert.equal(report.back.path, "/");
  assert.equal(report.back.language, "zh-CN");
  assert.equal(report.back.dark, changedTheme.dark);

  await tab.forward();
  await tab.getAXState({ emit: false });
  await tab.playwright.getByRole("link", { name: "切换到中文", exact: true }).click();
  report.returned = await inspect(tab);
  assert.equal(report.returned.path, "/");
  assert.equal(report.returned.language, "zh-CN");
  assert.equal(report.returned.dark, changedTheme.dark);
  assert.equal(report.returned.introduction, report.chinese.introduction);

  await tab.playwright.getByRole("button", { name: report.returned.dark ? "切换到浅色" : "切换到深色", exact: true }).click();
  await tab.getAXState({ emit: false });
  await settleTheme(tab);
  assert.equal((await inspect(tab)).dark, report.chinese.dark);
  return report;
}
