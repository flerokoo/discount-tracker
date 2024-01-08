import { IUser } from "@repo/domain/entities/IUser";
export type RequestContext = {
    user?: IUser;
};
export declare function runRequestWithinContext(context: RequestContext, fn: () => unknown): void;
export declare function hasCurrentUser(): boolean;
export declare function getCurrentUser(): IUser;
export declare function setCurrentUser(user: IUser): void;
//# sourceMappingURL=request-context.d.ts.map