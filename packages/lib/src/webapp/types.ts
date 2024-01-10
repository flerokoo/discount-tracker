import type { Binding } from "./Binding";
import { WebApplication } from ".";
import { Request, Response } from "express";
import { IUser } from "@repo/domain/src/entities/IUser";



export type WebApplicationHttpParams = {
  enabled: boolean;
  port: number;
  hostname?: string;
};

export type WebApplicationHttpsParams = WebApplicationHttpParams & {
  certPath: string;
  keyPath: string;
};

export type Authenticator = {
  (req: Request, res: Response) : IUser | null
}

export type AuthenticatorFactory = {
  (app: WebApplication) : Authenticator;
}

export type WebApplicationParams = {
  repositories?: (Binding<any> | Ctor<any>)[];
  services?: (Binding<any> | Ctor<any>)[];
  controllers?: (Binding<any> | Ctor<any>)[];
  auth?: AuthenticatorFactory;
  values?: Record<string,any>;
  http?: WebApplicationHttpParams;
  https?: WebApplicationHttpsParams;
};

export type Ctor<T> = { new (...args: any[]): T };
