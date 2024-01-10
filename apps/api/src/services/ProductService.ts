import { ProductRepository } from "@repo/domain/src/repositories/IProductRepository";
import { UserRepository } from "@repo/domain/src/repositories/IUserRepository";
import { getCurrentUser } from "@repo/lib/src/webapp/request-context";
import { inject, injectable } from "tsyringe";
import { ServiceGroup, discover } from "@repo/lib/src/dns/discover";
import { PriceRepository } from "@repo/domain/src/repositories/IPriceRepository";
import type { RedisClientType } from "redis";
import { AuthorizationError } from "@repo/lib/src/utils/errors";
import { IProduct } from "@repo/domain/src/entities/IProduct";
type ScraperScrapeDto = {
  imageUrl: string;
  title: string;
  price: number;
  currency: string;
};

const UPDATE_INTERVAL_HOURS = 12;

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
  constructor(
    private productRepo: ProductRepository,
    private userRepo: UserRepository,
    private priceRepo: PriceRepository,
    @inject("scraperHost") private scraperHost: string,
    @inject("scraperPort") private scraperPort: number,
    @inject("redisClient") private redisClient: RedisClientType<any, any, any>,
  ) {
    discover(scraperHost).then((_) => (this.scrapers = _));
    this.productListCache = redisNamespace(redisClient, (i) => "user:product_list:" + i);
  }

  async addProduct(url: string) {
    const currentUserId = getCurrentUser().id;
    const user = await this.userRepo.selectOne({ id: currentUserId });
    if (!user) throw new AuthorizationError("No user found in database");

    let product = await this.productRepo.selectOne({ url }, true);
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
      const scraper = await this.scrapers.getNextAlive();
      const scraperUrl = scraper.getUrl("/v1/scrape", "http", this.scraperPort);
      const result: ScraperScrapeDto = await fetch(scraperUrl).then((res) => res.json());
      const price = this.priceRepo.create({
        price: result.price,
        currency: result.currency,
      });
      product = this.productRepo.create({
        url,
        imageUrl: result.imageUrl,
        prices: [price],
      });
      await this.productRepo.save([product]);
    }

    user!.products.push(product!);

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
}
