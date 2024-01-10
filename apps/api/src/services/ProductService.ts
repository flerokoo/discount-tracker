import { ProductRepository, UserRepository, PriceRepository, IProduct } from "@repo/domain";
import {
  getCurrentUser,
  discover,
  AuthorizationError,
  ServiceGroup,
  AuthenticationError,
} from "@repo/lib";
import { inject, injectable } from "tsyringe";
import type { RedisClientType } from "redis";

type ScraperScrapeDto = {
  imageUrl: string;
  title: string;
  price: number;
  currency: string;
};

const UPDATE_INTERVAL_HOURS = 12;
const SCRAPE_RESULT_EX = 20 * 60; // twenty minutes

type NamespacedRedis<T> = {
  get(key: T): Promise<string | null>;
  set(
    key: T,
    value: string,
    opts?: {
      EX?: number;
    },
  ): Promise<string | null>;
  del(key: T): Promise<number>;
};

const redisNamespace = <T>(
  redisClient: RedisClientType<any, any, any>,
  keyGetter: (i: T) => string,
): NamespacedRedis<T> => {
  return {
    async get(key: T) {
      return await redisClient.get(keyGetter(key));
    },
    async set(key: T, value: string, opts?: { EX?: number }) {
      return await redisClient.set(keyGetter(key), value, opts);
    },
    async del(key: T) {
      return await redisClient.del(keyGetter(key));
    },
  };
};

@injectable()
export class ProductService {
  scrapers!: ServiceGroup;
  productListCache: NamespacedRedis<number>;
  scrapeResultCache: NamespacedRedis<string>;
  constructor(
    private productRepo: ProductRepository,
    private userRepo: UserRepository,
    private priceRepo: PriceRepository,
    @inject("scraperHost") private scraperHost: string,
    @inject("scraperPort") private scraperPort: number,
    @inject("redisClient") private redisClient: RedisClientType<any, any, any>,
  ) {
    discover(scraperHost).then((_) => (this.scrapers = _));
    this.productListCache = redisNamespace(redisClient, (i) => `user:${i}:product-list`);
    this.scrapeResultCache = redisNamespace(redisClient, (url) => `scrape-result:${url}`);
  }

  async addProduct(productUrl: string) {
    const currentUserId = getCurrentUser().id;
    const user = await this.userRepo.selectOne({ id: currentUserId });
    if (!user) throw new AuthorizationError("No user found in database");

    let product = await this.productRepo.selectOne({ url: productUrl }, true);
    let shouldScrapeNow = false;

    if (!product || product.prices.length === 0) {
      shouldScrapeNow = true;
    } else {
      const prices = product.prices;
      const lastPrice = prices[prices.length - 1]!;
      shouldScrapeNow =
        (Date.now() - lastPrice.createdAt.getTime()) / 36e5 >= UPDATE_INTERVAL_HOURS;
    }

    if (shouldScrapeNow) {
      const scrapeResult = await this.scrapeUrl(productUrl);

      const price = this.priceRepo.create({
        price: scrapeResult.price,
        currency: scrapeResult.currency,
      });

      product ??= this.productRepo.create({ url: productUrl });

      product.prices.push(price);
      product.imageUrl ??= scrapeResult.imageUrl;

      await this.productRepo.save([product]);
    }

    user!.products.push(product!);

    await this.userRepo.save([user]);
    await this.productListCache.del(user.id);
  }

  async deleteProduct(id: number) {
    const userId = getCurrentUser().id;

    const user = await this.userRepo.selectOne({ id: userId });
    if (!user) throw new AuthenticationError("No such user");

    user.products.splice(
      user.products.findIndex((_) => _.id === id),
      1,
    );

    await this.userRepo.save([user]);
    await this.productListCache.del(user.id);
  }

  async getProducts(): Promise<IProduct[]> {
    const user = getCurrentUser();
    const cached = await this.productListCache.get(user.id);
    if (cached) {
      return JSON.parse(cached) as IProduct[];
    } else {
      const result = await this.userRepo.selectOne({ id: user.id }).then((_) => _?.products);
      await this.productListCache.set(user.id, JSON.stringify(result));
      return result as IProduct[];
    }
  }

  private async scrapeUrl(productUrl: string): Promise<ScraperScrapeDto> {
    const cached = await this.scrapeResultCache.get(productUrl);
    if (cached) {
      return JSON.parse(cached) as ScraperScrapeDto;
    } else {
      const scraper = await this.scrapers.getNextAlive();
      const scraperUrl = scraper.getUrl("/v1/scrape", "http", this.scraperPort);
      const result: ScraperScrapeDto = await fetch(scraperUrl).then((res) => res.json());
      await this.scrapeResultCache.set(productUrl, JSON.stringify(result), {
        EX: SCRAPE_RESULT_EX,
      });
      return result;
    }
  }
}
