import { IUser } from "@repo/domain/entities/IUser";


export type JwtTokenValidator = {
  (token: string): IUser;
};

export const createJwtValidator =
  (service: AuthService): JwtTokenValidator =>
  (token: string) => {
    const user = service.verifyJwt(token) as IUser;
    return user;
  };
