import type { ZodTypeAny } from 'zod';
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
export type RouteParams = {
    checkAuth?: boolean;
    bodySchema?: ZodTypeAny;
};
export type RouteDefinition = {
    path: string;
    method: HttpMethod;
    propertyKey: string;
    params: RouteParams;
};
export type ControllerMetadata = {
    prefix: string;
    routes: RouteDefinition[];
};
export declare function Prefix(prefix: string): (target: Function) => void;
export declare function Post(path: string, params?: RouteParams): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export declare function Get(path: string, params?: RouteParams): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export declare function Delete(path: string, params?: RouteParams): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export declare function Put(path: string, params?: RouteParams): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void;
export declare function getControllerMetadata(proto: object): ControllerMetadata;
export {};
//# sourceMappingURL=Route.decorator.d.ts.map