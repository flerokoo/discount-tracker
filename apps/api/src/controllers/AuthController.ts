import { injectable } from "tsyringe";
import { Post, Prefix } from "@repo/lib/utils/Route.decorator";
import { AuthService } from "../services/AuthService";
import type { Request, Response } from "express";
import z from 'zod';
import { success } from '@repo/lib/utils/success'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5)
});

@injectable()
@Prefix("/v1/auth")
export class AuthController {
  service: AuthService;

  constructor( AuthService: AuthService) {
    this.service = AuthService;
  }

  @Post('/register', { bodySchema: credentialsSchema })
  async register(req: Request, res:Response) {
    const { email, password } = req.body;
    const token = await this.service.register(email, password);
    res.json(success({ token }))
  }

  @Post('/login', { bodySchema: credentialsSchema })
  async login(req: Request, res:Response) {
    const { email, password } = req.body;
    const token = await this.service.login(email, password);
    res.json(success({ token }))
  }

}
