/// <reference types="node" />
import { Service } from "./Service";
import EventEmitter from "node:events";
type ServiceGroupEvents = 'created' | 'dead';
declare const discover: (hostname: string, port: number) => Promise<{
    getNextAlive(): Service | undefined;
    getAll(): Service[];
    readonly aliveCount: number;
    on(evt: ServiceGroupEvents, listener: (...args: any[]) => void): EventEmitter;
    off(evt: ServiceGroupEvents, listener: (...args: any[]) => void): EventEmitter;
}>;
export { discover };
//# sourceMappingURL=discover.d.ts.map