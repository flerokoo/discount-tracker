import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import https from "https";
import { createWriteStream, mkdirSync, writeFileSync } from "fs";
import { createBrowser } from "./src/scraper/browser";
import { testProducts } from "./src/utils/test-products";
import { delay } from "./src/utils/utils";
import { cleanupPage } from "./src/scraper/cleanup-page";
import { findPriceCandidates } from "./src/scraper/extract-price";
import dotenv from "dotenv-safe";
import { Page } from "puppeteer";

dotenv.config({ allowEmptyValues: true });

export const extractPrice = async (page: Page) => {
  return await page.evaluate(() => {
    const CURRENCY_SYMBOLS =
      "$ € £ ¥ ₹ ₾ ₺ ₴ ₽ РУБ РУБ. USD EUR TL GBP GEL RUB ГРН".split(" ");

    const CURRENCY_REXES = CURRENCY_SYMBOLS.map((symbol) => [
      new RegExp("\\" + symbol + "\\s?[\\d\\,\\.]+", "i"),
      new RegExp("[\\d\\,\\.]+\\s?\\" + symbol, "i"),
    ]).flat();

    const sanitize = (text: string) => {
      const spaces = [" ", "&nbsp;", "&#160;", "&thinsp;"];
      return spaces.reduce(
        (result, space) => result.replaceAll(space, ""),
        text
      );
    };

    const getTreePath = (node: Element) => {
      const path = [];
      while (node) {
        const classes = node.className
          .split(" ")
          .map((_) => _.trim())
          .filter(Boolean)
          .map((_) => "." + _)
          .join("");
        const id = (node.id ? "#" + node.id : "").toLowerCase();
        const el = node.tagName.toLowerCase();
        path.unshift(el + id + classes);
        node = node.parentElement!;
      }
      return path;
    };

    const candidates = [...document.querySelectorAll("*")]
      .map((node) => {
        if (node.children.length > 0) return null;
        const text = sanitize(node.textContent || "");
        if (!CURRENCY_REXES.some((r) => r.test(text))) return null;
        const path = getTreePath(node);
        return { node, text, path };
      })
      .filter(Boolean)
      .filter((obj) => {
        // filter out striked prices
        const { node } = obj as { node: Element };
        return (
          getComputedStyle(node)
            .getPropertyValue("text-decoration")
            .toLowerCase()
            .indexOf("line-through") === -1
        );
      });

      return candidates;
  });
};

(async () => {
  const browser = await createBrowser(10);

  const data = await browser.run(async (page) => {
    await page.goto(testProducts[0]!);
    await delay(2000);
    const title = await page.title();
    await cleanupPage(page);
    const price = await extractPrice(page);
    console.log(price)
    // const content = await page.content();
    // const candidates = findPriceCandidates(content);
    // writeFileSync('output.txt', candidates.join("\n\n"))
    return { title };
  });

  console.log(data);

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
