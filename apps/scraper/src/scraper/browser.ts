import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import type { Page } from "puppeteer";
import { delay } from "../utils/utils";

export const createBrowser = async (concurrency: number) => {
  puppeteer.use(Stealth());

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--auto-open-devtools-for-tabs",
      "--disable-notifications",
      "--disable-dev-shm-usage",
    ],
    targetFilter: (target) => !!target.url,
  });

  type PageTask = (page: Page) => Promise<any>;

  let numPages = 0;
  const idlePages: Page[] = [];
  const tasks: PageTask[] = [];

  const next = async () => {
    if (tasks.length === 0) return;
    if (idlePages.length === 0 && numPages === concurrency) return;
    const task = tasks.shift()!;
    const page =
      idlePages.length > 0
        ? idlePages.pop()!
        : (numPages++, await browser.newPage());
    await task(page);
    idlePages.push(page);
    next();
  };

  return {
    async run(cb: PageTask) {
      return new Promise<void>((resolve) => {
        tasks.push(async (page: Page) => {
          const result = await cb(page);
          resolve(result);
        });
        next();
      });
    },
    async close() {
      await browser.close();
    },
  };
};
