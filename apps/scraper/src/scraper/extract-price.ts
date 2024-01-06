const CURRENCY_SYMBOLS =
  "$ € £ ¥ ₹ ₾ ₺ ₴ ₽ РУБ РУБ. USD EUR TL GBP GEL RUB ГРН".split(" ");

const CURRENCY_REXES = CURRENCY_SYMBOLS.map((symbol) => [
  new RegExp("\\" + symbol + "\\s?[\\d\\,\\.]+", "i"),
  new RegExp("[\\d\\,\\.]+\\s?\\" + symbol, "i"),
]).flat();

const sanitize = (text: string) => {
  const spaces = [" ", "&nbsp;", "&#160;", "&thinsp;"];
  return spaces.reduce((result, space) => result.replaceAll(space, ""), text);
};

const expandByTags = (
  content: string,
  index: number,
  numTags: number,
  maxLen = 220
) => {
  let left = index;
  let numLeftTags = 0;
  let right = index;
  let numRightTags = 0;
  while (left > -1 && numLeftTags < numTags && index - left < maxLen / 2) {
    if (content[left--] === "<") numLeftTags++;
  }
  while (
    right < content.length &&
    numRightTags < numTags &&
    right - index < maxLen / 2
  ) {
    if (content[right++] === ">") numRightTags++;
  }

  return content.substring(left + 1, right);
};

const containsPrice = (text: string) => {
  return CURRENCY_REXES.some((rex) => rex.test(text));
};

export const findPriceCandidates = (content: string) => {
  const candidates: string[] = [];
  for (let symbol of CURRENCY_SYMBOLS) {
    const matches = content.matchAll(new RegExp("\\" + symbol, "ig"));
    for (let match of matches) {
      if (!match[0] || !match.index) continue;
      let candidate = expandByTags(content, match.index, 2);
      candidate = sanitize(candidate);
      if (!containsPrice(candidate)) continue;
      candidates.push(candidate);
    }
  }
  return candidates;
};

