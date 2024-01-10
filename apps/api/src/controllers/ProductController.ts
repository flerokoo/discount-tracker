import { Get, Post, Prefix } from "@repo/lib/src/utils/Route.decorator";
import { injectable } from "tsyringe";
import type { Request, Response } from "express";
import { success } from "@repo/lib/src/utils/success";
import zod from "zod";
import { ProductService } from "../services/ProductService";


@injectable()
@Prefix("/v1/products")
export class ProductController {
  constructor(private productService: ProductService) { }

  @Post("/", {
    checkAuth: true,
    bodySchema: zod.object({
      url: zod.string().url(),
    }),
  })
  async addProduct(req: Request, res: Response) {
    const { url } = req.body;
    await this.productService.addProduct(url);
    res.json(success());
  }

  @Get("/", { checkAuth: true })
  async getProducts(req: Request, res: Response) {
    const products = await this.productService.getProducts();
    res.json(success({ products }));
  }
}
