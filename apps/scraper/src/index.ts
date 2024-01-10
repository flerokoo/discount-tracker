import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import https from "https";
import { createWriteStream, mkdirSync, writeFileSync } from "fs";
import { createBrowser } from "./scraper/browser";
import { testCases } from "./utils/test-products";
import { delay } from "./utils/utils";
import { cleanupPage } from "./scraper/cleanup-page";
import { extractPrice } from "./scraper/extract-price";
import dotenv from "dotenv-safe";
import { Page } from "puppeteer";

dotenv.config({ allowEmptyValues: true });

(async () => {
  const browser = await createBrowser(10);

  const usedTestCases = [4].map((_) => testCases[_] as [number, string]);
  for (let [realPrice, url] of usedTestCases) {
    console.log("\n");
    console.log(url);
    console.log("----------------------");
    console.log("should be " + realPrice);
    const data = await browser.run(async (page) => {
      await Promise.race([page.goto(url), delay(10000)]);
      await delay(2000);
      const title = await page.title();
      const content = await page.content();
      await cleanupPage(page);
      const data = await extractPrice(page);
      const { detectedPrice, candidates } = data;
      return { title, realPrice, detectedPrice, candidates, content };
    });

    console.log("got " + data?.detectedPrice);
    console.log(data?.candidates);
    writeFileSync("output.html", data?.content || "");
  }
  await browser.close();
})();
