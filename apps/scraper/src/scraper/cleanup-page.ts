import type { Page } from "puppeteer";

export const cleanupPage = async (page: Page) =>
  await page.evaluate(() => {
    const removed = [
      "header",
      "footer",
      "head",
      "#header",
      "#footer",
      "#sidebar",
      ".header",
      ".footer",
      ".sidebar",
    ];
    removed.forEach((_) => document.querySelector(_)?.remove());

    const removedAll = ["script", "link"];
    removedAll.forEach((_) =>
      [...document.querySelectorAll(_)].forEach((_) => _.remove())
    );
  });
