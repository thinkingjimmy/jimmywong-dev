/**
 * [INPUT]: An initialized CUA browser tab, local preview URL, and optional screenshot sink.
 * [OUTPUT]: Writing index, header, desktop, mobile, and scrollbar checks with repeatable JSON evidence.
 * [POS]: Focused writing navigation checks; no unit tests or new test dependencies.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import assert from "node:assert/strict";

const LONG = "no-loyalty-to-ai-coding-tools";
const SECOND = "enterprise-ai-adoption-roi";

async function resetRoute(tab, url) {
  if (await tab.url() === url) await tab.reload();
  else await tab.goto(url);
}

async function inspect(tab) {
  await tab.getAXState({ emit: false });
  return tab.playwright.evaluate(() => {
    const row = document.querySelector("#writing-pane-row");
    const page = document.querySelector('[data-stage-item="page"]');
    const hint = document.querySelector("[data-follow-hint]");
    const panes = [...document.querySelectorAll("[data-pane]")].map((element) => ({
      slug: element.getAttribute("data-pane"),
      x: element.getBoundingClientRect().x,
      scroll: element.querySelector(".pane-scroll").scrollTop,
    }));
    return {
      panes,
      active: document.querySelector(".writing-stage").getAttribute("data-active"),
      pageX: page.getBoundingClientRect().x,
      pageScroll: document.querySelector("#open-page-scroll").scrollTop,
      rowScroll: row.scrollLeft,
      rowWidth: row.clientWidth,
      rowMax: row.scrollWidth - row.clientWidth,
      hint: hint ? getComputedStyle(hint).display : null,
      embed: document.querySelector("iframe[data-tweet-id]")?.getAttribute("src"),
    };
  });
}

async function waitForLeftEdge(tab, initial) {
  let state = initial;
  const deadline = Date.now() + 1500;
  while (state.rowWidth >= 1152 && Math.abs(state.pageX) >= 1 && Date.now() < deadline) {
    // Observe the visible slide before asserting its final position.
    await tab.getScreenshot({ emit: false });
    state = await inspect(tab);
  }
  return state;
}

async function open(tab, slug, keyboard = false) {
  const link = tab.playwright.locator(`a[href="/writing/${slug}"]`);
  if (keyboard) await link.press("Enter");
  else await link.click();
  return inspect(tab);
}

async function close(tab, slug) {
  await tab.playwright.locator(`[data-pane="${slug}"]`).getByRole("button", { name: "关闭", exact: true }).click();
  await tab.playwright.locator(`[data-pane="${slug}"]`).waitFor({ state: "detached" });
  return inspect(tab);
}

async function capture(tab, callback, name) {
  if (callback) await callback(name, await tab.screenshot({ fullPage: false }));
}

export async function verifyDesktopPanes(tab, { baseUrl = "http://localhost:3000", capture: save } = {}) {
  const evidence = {};
  await resetRoute(tab, `${baseUrl}/`);
  evidence.initial = await inspect(tab);
  assert.equal(evidence.initial.active, "false");
  assert.equal(evidence.initial.hint, "flex");

  evidence.first = await waitForLeftEdge(tab, await open(tab, LONG));
  assert.equal(evidence.first.panes.length, 1);
  assert.equal(evidence.first.hint, "none");
  if (evidence.first.rowWidth >= 1152) {
    assert.ok(Math.abs(evidence.first.pageX) < 1, "The open home column must start at the viewport's left edge.");
  }
  await tab.playwright.locator(`[role="scrollbar"][aria-controls="article-scroll-${LONG}"]`).press("PageDown");
  evidence.reading = await inspect(tab);
  const scroll = evidence.reading.panes[0].scroll;
  assert.ok(scroll > 0, "The article must be scrolled before opening another pane.");

  evidence.second = await open(tab, SECOND);
  assert.equal(evidence.second.panes.map(({ slug }) => slug).join("|"), `${LONG}|${SECOND}`);
  assert.equal(evidence.second.panes[0].scroll, scroll);
  assert.equal(evidence.second.embed, evidence.reading.embed);
  assert.equal(evidence.second.pageScroll, evidence.reading.pageScroll);
  assert.ok(evidence.second.rowMax > 0);

  const horizontal = tab.playwright.locator('[role="scrollbar"][aria-orientation="horizontal"]');
  await horizontal.press("Home");
  evidence.left = await inspect(tab);
  assert.ok(Math.abs(evidence.left.pageX) < 1);
  await capture(tab, save, "desktop-left");
  await horizontal.press("End");
  evidence.right = await inspect(tab);
  assert.ok(evidence.right.pageX < -100, "The home column must scroll with the article row.");
  assert.ok(Math.abs(evidence.right.rowScroll - evidence.right.rowMax) < 1);
  await capture(tab, save, "desktop-right");

  evidence.closeLast = await close(tab, SECOND);
  assert.equal(evidence.closeLast.panes.length, 1);
  assert.equal(evidence.closeLast.panes[0].scroll, scroll);
  await open(tab, SECOND);
  evidence.closeFirst = await close(tab, LONG);
  assert.equal(evidence.closeFirst.panes.map(({ slug }) => slug).join("|"), SECOND);
  evidence.closed = await close(tab, SECOND);
  assert.equal(evidence.closed.active, "false");
  assert.equal(evidence.closed.hint, "flex");
  assert.ok(Math.abs(evidence.closed.pageX - evidence.initial.pageX) < 1, "Closing all panes must restore the centered home column.");

  evidence.keyboard = await open(tab, SECOND, true);
  await tab.playwright.locator(`#writing-article-${SECOND}`).press("Escape");
  evidence.escape = await inspect(tab);
  assert.equal(evidence.escape.panes.length, 0);

  await resetRoute(tab, `${baseUrl}/writing`);
  await inspect(tab);
  await open(tab, SECOND);
  await tab.back();
  evidence.back = await inspect(tab);
  assert.equal(evidence.back.panes.length, 0);
  await tab.forward();
  evidence.forward = await inspect(tab);
  assert.equal(evidence.forward.panes.map(({ slug }) => slug).join("|"), SECOND);
  await close(tab, SECOND);
  assert.equal(await tab.url(), `${baseUrl}/writing`);
  return { status: "passed", suite: "desktop-panes", evidence };
}

export async function verifyMobilePanes(tab, { baseUrl = "http://localhost:3000", capture: save } = {}) {
  const evidence = {};
  await resetRoute(tab, `${baseUrl}/`);
  await inspect(tab);
  evidence.first = await open(tab, LONG);
  assert.ok(evidence.first.rowWidth < 768);
  assert.equal(evidence.first.hint, "none");
  assert.ok(Math.abs(evidence.first.panes[0].x) < 2);
  await capture(tab, save, "mobile-article");

  const horizontal = tab.playwright.locator('[role="scrollbar"][aria-orientation="horizontal"]');
  await horizontal.press("Home");
  evidence.home = await inspect(tab);
  assert.ok(Math.abs(evidence.home.pageX) < 1);
  evidence.second = await open(tab, SECOND);
  assert.equal(evidence.second.panes.length, 2);
  assert.ok(evidence.second.rowScroll > evidence.second.rowWidth);
  assert.ok(Math.abs(evidence.second.panes[1].x) < 2);
  await close(tab, SECOND);
  await tab.playwright.locator(`#writing-article-${LONG}`).press("Escape");
  evidence.closed = await inspect(tab);
  assert.equal(evidence.closed.panes.length, 0);
  assert.equal(evidence.closed.active, "false");
  return { status: "passed", suite: "mobile-panes", evidence };
}

async function inspectScrollbars(tab) {
  await tab.getAXState({ emit: false });
  return tab.playwright.evaluate(() => [...document.querySelectorAll('[role="scrollbar"][aria-orientation="vertical"]')].map((element) => {
    const thumb = element.querySelector("span").getBoundingClientRect();
    const region = element.closest(".pane-scroll-region").getBoundingClientRect();
    return {
      controls: element.getAttribute("aria-controls"),
      opacity: Number(getComputedStyle(element.parentElement.parentElement).opacity),
      width: thumb.width,
      gap: region.right - thumb.right,
    };
  }));
}

export async function verifyScrollbarHover(tab, { baseUrl = "http://localhost:3000", capture: save } = {}) {
  const evidence = {};
  await resetRoute(tab, `${baseUrl}/`);
  await inspect(tab);
  const first = await open(tab, LONG);
  assert.ok(first.rowWidth > 1152, "Use a desktop viewport wider than the two columns.");
  await tab.click([first.rowWidth - 8, 200]);
  await capture(tab, save, "scrollbars-hidden");
  evidence.outside = await inspectScrollbars(tab);
  assert.ok(evidence.outside.every(({ opacity }) => opacity < 0.05));

  await tab.playwright.locator(`#writing-article-${LONG}`).click();
  await capture(tab, save, "scrollbar-article-hover");
  evidence.article = await inspectScrollbars(tab);
  const article = evidence.article.find(({ controls }) => controls === `article-scroll-${LONG}`);
  const page = evidence.article.find(({ controls }) => controls === "open-page-scroll");
  assert.ok(article.opacity > 0.95);
  assert.ok(page.opacity < 0.05);
  assert.equal(article.width, 3);
  assert.ok(article.gap <= 2);

  await tab.playwright.getByText("一名懂点产品设计，又懂点代码的产品经理。", { exact: true }).click();
  await capture(tab, save, "scrollbar-home-hover");
  evidence.home = await inspectScrollbars(tab);
  assert.ok(evidence.home.find(({ controls }) => controls === "open-page-scroll").opacity > 0.95);
  assert.ok(evidence.home.find(({ controls }) => controls === `article-scroll-${LONG}`).opacity < 0.05);
  await close(tab, LONG);
  return { status: "passed", suite: "scrollbar-hover", evidence };
}

export async function verifyRapidReopen(tab, { baseUrl = "http://localhost:3000" } = {}) {
  await resetRoute(tab, `${baseUrl}/`);
  await inspect(tab);
  await open(tab, SECOND);
  const link = tab.playwright.locator(`a[href="/writing/${SECOND}"]`);
  for (let index = 0; index < 3; index++) {
    await tab.playwright.locator(`[data-pane="${SECOND}"]`).getByRole("button", { name: "关闭", exact: true }).click({ force: true });
    await link.click({ force: true });
  }
  const evidence = await inspect(tab);
  assert.equal(evidence.panes.map(({ slug }) => slug).join("|"), SECOND);
  assert.equal(await tab.playwright.locator('[data-exiting="true"]').count(), 0);
  await close(tab, SECOND);
  return { status: "passed", suite: "rapid-reopen", evidence };
}

export async function verifyWritingIndexPanes(tab, { baseUrl = "http://localhost:3000", capture: save } = {}) {
  const evidence = {};
  await resetRoute(tab, `${baseUrl}/`);
  evidence.initial = await inspect(tab);
  evidence.header = await tab.playwright.evaluate(() => {
    const header = document.querySelector("header");
    const greeting = header.querySelector("h1").getBoundingClientRect();
    const theme = header.querySelector("button").getBoundingClientRect();
    return {
      navigationCount: header.querySelectorAll("nav").length,
      greetingCenterY: greeting.top + greeting.height / 2,
      themeCenterY: theme.top + theme.height / 2,
      themeWidth: theme.width,
      themeHeight: theme.height,
      themeLeft: theme.left,
      greetingRight: greeting.right,
    };
  });
  assert.equal(evidence.header.navigationCount, 0);
  assert.ok(Math.abs(evidence.header.greetingCenterY - evidence.header.themeCenterY) < 1);
  assert.equal(evidence.header.themeWidth, 44);
  assert.equal(evidence.header.themeHeight, 44);
  assert.ok(evidence.header.themeLeft > evidence.header.greetingRight);
  await capture(tab, save, "header");

  const viewAll = tab.playwright.getByRole("link", { name: "查看全部 →", exact: true });
  const index = tab.playwright.locator('[data-pane="writing-index"]');
  const indexArticle = () => index.locator(`a[href="/writing/${LONG}"]`);
  await viewAll.click();
  evidence.index = await waitForLeftEdge(tab, await inspect(tab));
  assert.equal(evidence.index.panes.map(({ slug }) => slug).join("|"), "writing-index");
  assert.equal(evidence.index.hint, "none");
  if (evidence.index.rowWidth >= 1152) {
    assert.ok(Math.abs(evidence.index.pageX) < 1, "Opening the index must align the home column to the left edge.");
  }
  assert.equal(await tab.url(), `${baseUrl}/writing`);
  assert.equal(await index.getAttribute("aria-label"), "文章列表");
  assert.equal(await index.getByRole("heading", { name: "Writing", exact: true }).count(), 1);
  assert.equal(await tab.playwright.getByText("一名懂点产品设计，又懂点代码的产品经理。", { exact: true }).count(), 1);
  assert.equal(await tab.playwright.evaluate(() => document.activeElement.id), "writing-index-heading");
  if (evidence.index.rowWidth < 768) assert.ok(Math.abs(evidence.index.panes[0].x) < 2);
  await capture(tab, save, "writing-index");

  await viewAll.click();
  evidence.repeated = await inspect(tab);
  assert.equal(evidence.repeated.panes.length, 1);

  await indexArticle().click();
  evidence.article = await inspect(tab);
  assert.equal(evidence.article.panes.map(({ slug }) => slug).join("|"), `writing-index|${LONG}`);
  assert.equal(await tab.url(), `${baseUrl}/writing/${LONG}`);
  await tab.playwright.locator(`[role="scrollbar"][aria-controls="article-scroll-${LONG}"]`).press("PageDown");
  evidence.reading = await inspect(tab);
  const scroll = evidence.reading.panes[1].scroll;
  assert.ok(scroll > 0);
  await capture(tab, save, "index-and-article");

  evidence.closeIndex = await close(tab, "writing-index");
  assert.equal(evidence.closeIndex.panes.map(({ slug }) => slug).join("|"), LONG);
  assert.equal(evidence.closeIndex.panes[0].scroll, scroll);
  assert.equal(evidence.closeIndex.embed, evidence.reading.embed);
  await viewAll.click();
  evidence.reopenIndex = await inspect(tab);
  assert.equal(evidence.reopenIndex.panes.map(({ slug }) => slug).join("|"), `${LONG}|writing-index`);
  assert.equal(evidence.reopenIndex.panes[0].scroll, scroll);
  await close(tab, "writing-index");
  await tab.playwright.locator(`#writing-article-${LONG}`).press("Escape");
  evidence.closed = await inspect(tab);
  assert.equal(evidence.closed.panes.length, 0);
  assert.equal(await tab.url(), `${baseUrl}/`);
  assert.equal(await tab.playwright.evaluate(() => document.activeElement.getAttribute("href")), `/writing/${LONG}`);

  await viewAll.press("Enter");
  evidence.keyboard = await inspect(tab);
  assert.equal(evidence.keyboard.panes.length, 1);
  await tab.playwright.locator("#writing-index-heading").press("Escape");
  evidence.escape = await inspect(tab);
  assert.equal(evidence.escape.panes.length, 0);
  assert.equal(await tab.playwright.evaluate(() => document.activeElement.textContent), "查看全部 →");

  await viewAll.click();
  await inspect(tab);
  await indexArticle().click();
  await inspect(tab);
  await tab.back();
  evidence.backToIndex = await inspect(tab);
  assert.equal(evidence.backToIndex.panes.map(({ slug }) => slug).join("|"), "writing-index");
  assert.equal(await tab.url(), `${baseUrl}/writing`);
  await tab.back();
  evidence.backToHome = await inspect(tab);
  assert.equal(evidence.backToHome.panes.length, 0);
  await tab.forward();
  evidence.forwardIndex = await inspect(tab);
  assert.equal(evidence.forwardIndex.panes.map(({ slug }) => slug).join("|"), "writing-index");
  await tab.forward();
  evidence.forwardArticle = await inspect(tab);
  assert.equal(evidence.forwardArticle.panes.map(({ slug }) => slug).join("|"), `writing-index|${LONG}`);
  await close(tab, LONG);
  evidence.returnToIndex = await inspect(tab);
  assert.equal(evidence.returnToIndex.panes.length, 1);
  assert.equal(await tab.url(), `${baseUrl}/writing`);
  await tab.reload();
  evidence.directIndex = await inspect(tab);
  assert.equal(evidence.directIndex.panes.length, 0);
  assert.equal(await tab.playwright.getByRole("heading", { name: "Writing", exact: true }).count(), 1);
  assert.equal(await tab.url(), `${baseUrl}/writing`);
  return { status: "passed", suite: "writing-index-panes", evidence };
}
