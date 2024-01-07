import type { Page } from "puppeteer";

export const cleanupPage = async (page: Page) =>
  await page.evaluate(() => {
    const removed = [
      "header",
      "footer",
      "#header",
      "#footer",
      "#sidebar",
      ".header",
      ".footer",
      ".sidebar", 
    ];
    removed.forEach((_) => document.querySelector(_)?.remove());

    const removedAll = ["script"];
    removedAll.forEach((_) =>
      [...document.querySelectorAll(_)].forEach((_) => _.remove())
    );
  });
