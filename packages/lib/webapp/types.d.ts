import type { Binding } from "./Binding";
import { WebApplication } from ".";
import { Request, Response } from "express";
import { IUser } from "@repo/domain/entities/IUser";
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
    (req: Request, res: Response): IUser;
};
export type AuthenticatorFactory<TRepository, TService, TController> = {
    (app: WebApplication<TRepository, TService, TController>): Authenticator;
};
export type WebApplicationParams<TRepository, TService, TController> = {
    repositories: (Binding<TRepository> | Ctor<TRepository>)[];
    services: (Binding<TService> | Ctor<TService>)[];
    controllers: (Binding<TController> | Ctor<TController>)[];
    auth?: AuthenticatorFactory<TRepository, TService, TController>;
    values?: Record<string, any>;
    http?: WebApplicationHttpParams;
    https?: WebApplicationHttpsParams;
};
export type Ctor<T> = {
    new (...args: any[]): T;
};
//# sourceMappingURL=types.d.ts.map