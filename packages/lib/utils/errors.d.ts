/// <reference types="node" />
export declare const HTTP_OK = 200;
export declare const HTTP_BAD_REQUEST = 400;
export declare const HTTP_UNAUTHORIZED = 401;
export declare const HTTP_FORBIDDEN = 403;
export declare const HTTP_CONFLICT = 409;
export declare const HTTP_NOT_FOUND = 404;
export declare const HTTP_TOO_MANY_REQUESTS = 429;
export declare const HTTP_INTERNAL_SERVER_ERROR = 500;
export declare const HTTP_SERVICE_UNAVAILABLE = 503;
export type HttpStatus = typeof HTTP_OK | typeof HTTP_BAD_REQUEST | typeof HTTP_UNAUTHORIZED | typeof HTTP_FORBIDDEN | typeof HTTP_NOT_FOUND | typeof HTTP_INTERNAL_SERVER_ERROR | typeof HTTP_CONFLICT | typeof HTTP_SERVICE_UNAVAILABLE | typeof HTTP_TOO_MANY_REQUESTS;
export declare class ApplicationError extends Error {
    status: number;
    payload: object | undefined;
    constructor(message?: string, payload?: object);
}
export declare const ValidationError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const AuthenticationError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const AuthorizationError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotFoundError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ConflictError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const InternalError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ServiceUnavailableError: {
    new (message?: string, payload?: object): {
        status: number;
        payload: object | undefined;
        name: string;
        message: string;
        stack?: string | undefined;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
//# sourceMappingURL=errors.d.ts.map