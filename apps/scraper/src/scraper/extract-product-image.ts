
const guessCoverImage = async (page) => {
  return await page.evaluate(() => {
    const score = (img) => {
      const area = img.width * img.height;
      const aspect = img.width / img.height;
      const aspectScoreMultiplier = aspect > 1 && aspect < 2 ? 1.5 : 1;
      return area * aspectScoreMultiplier;
    };

    const images = [...document.querySelectorAll("img")];
    const sortedImages = images
      .filter((_) => !_.src.toLowerCase().startsWith("data"))
      .sort((a, b) => score(b) - score(a));
    return sortedImages[0].src;
  });
};
