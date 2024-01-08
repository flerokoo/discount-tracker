// import { Get } from "@repo/lib/utils/Route.decorator";
import type { Request, Response } from 'express';

export class Controller {
  // @Get("/hello")
  private helloWorld(req: Request, res: Response) {
    res.end("world!");
  }
}
