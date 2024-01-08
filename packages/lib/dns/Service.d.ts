/// <reference types="node" />
import EventEmitter from "node:events";
export declare class Service extends EventEmitter {
    readonly address: string;
    private _isAlive;
    private _healtCheckScheduler;
    private _healthCheckTimeoutInstance;
    constructor(address: string);
    getBaseUrl(protocol: "http" | "https", port: number): string;
    get isAlive(): boolean;
    private ping;
    enableHealthCheck(port: number, url?: string, interval?: number, protocol?: "http" | "https"): void;
    disableHealthCheck(): void;
}
//# sourceMappingURL=Service.d.ts.map