import { Delete, Get, Post, Prefix, success } from "@repo/lib";
import { injectable } from "tsyringe";
import type { Request, Response } from "express";
import zod from "zod";
import { ProductService } from "../services/ProductService";

const addProductBodySchema = zod.object({
  url: zod.string().url(),
});

const deleteProductParamsSchema = zod.object({
  id: zod.number().nonnegative(),
});

@injectable()
@Prefix("/v1/products")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post("/", {
    checkAuth: true,
    bodySchema: addProductBodySchema,
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

  @Delete("/:id", { checkAuth: true, paramsSchema: deleteProductParamsSchema })
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    await this.productService.deleteProduct(parseInt(id!));
    res.json(success());
  }
}
