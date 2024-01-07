import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import https from "https";
import { createWriteStream, mkdirSync, writeFileSync } from "fs";
import { createBrowser } from "./src/scraper/browser";
import { testCases } from "./src/utils/test-products";
import { delay } from "./src/utils/utils";
import { cleanupPage } from "./src/scraper/cleanup-page";
import { extractPrice } from "./src/scraper/extract-price";
import dotenv from "dotenv-safe";
import { Page } from "puppeteer";

dotenv.config({ allowEmptyValues: true });


(async () => {
  const browser = await createBrowser(10);

  const usedTestCases = [3].map((_) => testCases[_] as [number, string]);
  for (let [realPrice, url] of usedTestCases) {
    console.log("\n");
    console.log(url);
    console.log("----------------------");
    console.log("should be " + realPrice);
    const data = await browser.run(async (page) => {
      await page.goto(url);
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

// const guessCoverImage = async (page) => {
//   return await page.evaluate(() => {
//     const score = (img) => {
//       const area = img.width * img.height;
//       const aspect = img.width / img.height;
//       const aspectScoreMultiplier = aspect > 1 && aspect < 2 ? 1.5 : 1;
//       return area * aspectScoreMultiplier;
//     };

//     const images = [...document.querySelectorAll("img")];
//     const sortedImages = images
//       .filter((_) => !_.src.toLowerCase().startsWith("data"))
//       .sort((a, b) => score(b) - score(a));
//     return sortedImages[0].src;
//   });
// };
