import "reflect-metadata";
import { DependencyContainer } from "tsyringe";
import { WebApplicationParams } from "./types";
export declare class WebApplication<TRepository, TService, TController> {
    readonly container: DependencyContainer;
    private params;
    private httpServer;
    private httpsServer;
    private expressApp;
    private listening;
    constructor(params: WebApplicationParams<TRepository, TService, TController>);
    private registerValues;
    private registerServices;
    listen(): Promise<void>;
    close(): Promise<void>;
    private createExpressApp;
}
//# sourceMappingURL=index.d.ts.map