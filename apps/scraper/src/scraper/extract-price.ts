import { Page } from "puppeteer";

export const extractPrice = async (page: Page) => {
  return await page.evaluate(() => {
    const MAIN_CONTAINERS = ["main", "#main", ".main", "#main-container", ".main-container"];
    const CURRENT_PRICES = ["current", "final"]
      .map((word) => [word + "_price", word + "-price", "price_" + word, "price-" + word])
      .flat();
    const mainSelector = MAIN_CONTAINERS.find((_) => !!document.querySelector(_));
    const mainBlock = mainSelector ? document.querySelector(mainSelector) : null;
    const CURRENCY_SYMBOLS = "$ € £ ¥ ₹ ₾ ₺ ₴ ₽".toLowerCase().split(" ");
    const CURRENCY_ABBR = "РУБ РУБ. USD EUR TL GBP GEL RUB ГРН".toLowerCase().split(" ");
    const CURRENCY_REXES = [
      ...CURRENCY_SYMBOLS.map((symbol) => [
        new RegExp("\\" + symbol + "\\s?([\\d\\,\\.]+)", "i"),
        new RegExp("([\\d\\,\\.]+)\\s?\\" + symbol, "i"),
      ]).flat(),
      ...CURRENCY_ABBR.map((abbr) => [
        new RegExp(abbr + "\\s?([\\d\\,\\.]+)", "i"),
        new RegExp("([\\d\\,\\.]+)\\s?" + abbr, "i"),
      ]).flat(),
    ];

    const unifyPrice = (text: string) => {
      const SEP = ".";
      text = text.replace(",", SEP);
      const lastIndex = text.lastIndexOf(SEP);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "." && i !== lastIndex) continue;
        out += char;
      }
      return out;
    };

    const extractPrice = (text: string) => {
      for (let re of CURRENCY_REXES) {
        const result = text.match(re);
        if (!result || !result[1]) continue;
        const price = parseFloat(unifyPrice(result[1]));
        if (!isNaN(price)) return price;
      }
      return null;
    };

    const extractCurrency = (text: string) => CURRENCY_SYMBOLS.find((_) => text.includes(_));

    const containsCurrency = (text: string) =>
      CURRENCY_SYMBOLS.some((_) => text.toLowerCase().includes(_));

    const containsPrice = (text: string) => CURRENCY_REXES.some((r) => r.test(text));

    const sanitize = (text: string) => {
      const spaces = [" ", "&nbsp;", "&#160;", "&thinsp;"];
      return spaces.reduce((result, space) => result.replaceAll(space, ""), text);
    };

    const getTreePath = (node: HTMLElement) => {
      const path = [];
      const dataset = [];
      while (node && node.tagName !== "BODY") {
        const classes = node.className
          .split(" ")
          .map((_) => _.trim())
          .filter(Boolean)
          .map((_) => "." + _)
          .join("");
        const id = (node.id ? "#" + node.id : "").toLowerCase();
        const el = node.tagName.toLowerCase();
        path.unshift(el + id + classes);
        if (Object.keys(node.dataset).length > 0) dataset.push({ ...node.dataset });
        node = node.parentElement!;
      }
      return { path, dataset };
    };

    const getConvolution = (node: HTMLElement) => {
      const originalNode = node;
      const open: string[] = [];
      const close: string[] = [];
      while (node && node.tagName !== "BODY") {
        let parts: string[] = [];
        if (node.id) parts.push(`id="${node.id}"`);
        if (node.className) parts.push(`class="${node.className}"`);
        for (let key of Object.keys(node.dataset)) {
          parts.push(`data-${key}="${node.dataset[key]}"`);
        }
        let tagName = node.tagName.toLowerCase();
        open.unshift(`<${tagName} ${parts.join(" ")}>`);
        close.push(`</${tagName}>`);
        node = node.parentElement!;
      }
      return open.join("\n") + originalNode.innerText + close.join("");
    };

    const getFontSize = (node: HTMLElement) => {
      const size = getComputedStyle(node).getPropertyValue("font-size");
      const f = parseFloat(size);
      return isNaN(f) ? 0 : f;
    };

    const processCompoundPrice = (node: HTMLElement) => {
      const text = sanitize(node.innerText);
      if (isNaN(parseFloat(text))) return false;
      const siblings = [node.nextElementSibling, node.previousElementSibling].filter(
        Boolean,
      ) as HTMLElement[];
      for (let sibling of siblings) {
        const siblingText = sibling!.innerText?.toLowerCase() || "";
        if (containsCurrency(siblingText)) {
          node.innerText = extractCurrency(siblingText) + node.innerText;
          return true;
        }
      }
      return false;
    };

    type Candidate = {
      node: HTMLElement;
      text: string;
      path: string[];
      dataset: object[];
      convo: string;
      fontSize: number;
    };

    const candidates = [...document.querySelectorAll("*")]
      .map((node) => {
        if (!(node instanceof HTMLElement)) return null;
        if (node.children.length > 0) return null;
        let text = sanitize(node.textContent || "");
        if (!containsPrice(text) && !processCompoundPrice(node)) return null;
        const { path, dataset } = getTreePath(node);
        const convo = getConvolution(node);
        const fontSize = getFontSize(node);
        text = sanitize(node.textContent || "");
        return { node, text, path, dataset, convo, fontSize };
      })
      .filter(Boolean)
      .map((obj) => {
        // cast to non-null (too lazy to write a predicate)
        return obj as Candidate;
      })
      .filter((obj) => {
        // filter out striked prices
        const { node } = obj as { node: Element };
        return (
          getComputedStyle(node)
            .getPropertyValue("text-decoration")
            .toLowerCase()
            .indexOf("line-through") === -1
        );
      })
      .filter(({ node }) => {
        // filter non-main block descendants
        if (!mainBlock) return true;
        return mainBlock.contains(node);
      });

    const score = ({ text, convo, fontSize }: Candidate) => {
      const price = extractPrice(text);
      if (typeof price !== "number" || isNaN(price)) return -1;
      let score = fontSize;
      if (CURRENT_PRICES.some((_) => convo.includes(_))) score *= 2;
      return score;
    };

    candidates.sort((a, b) => score(b) - score(a));

    candidates.forEach((_: any) => {
      delete _["node"];
      delete _["path"];
      delete _["dataset"];
      delete _["convo"];
    });

    const detectedPrice =
      candidates.length > 0 ? (extractPrice(candidates[0]!.text) as number) : -1;
    return { detectedPrice, candidates };
  });
};
