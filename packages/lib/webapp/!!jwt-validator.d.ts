import { IUser } from "@repo/domain/entities/IUser";
export type JwtTokenValidator = {
    (token: string): IUser;
};
export declare const createJwtValidator: (service: AuthService) => JwtTokenValidator;
//# sourceMappingURL=!!jwt-validator.d.ts.map