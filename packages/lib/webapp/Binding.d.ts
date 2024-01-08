import { InjectionToken } from "tsyringe";
import { Ctor } from "./types";
export declare class Binding<T> {
    token: InjectionToken;
    value: Ctor<T>;
    constructor(token: InjectionToken, value: Ctor<T>);
    as(token: InjectionToken): this;
}
export declare const bind: <T>(type: Ctor<T>) => Binding<T>;
//# sourceMappingURL=Binding.d.ts.map