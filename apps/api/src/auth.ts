import { AuthService } from "./services/AuthService";
import {
  WebApplication,
  AuthenticatorFactory,
} from "@repo/lib";
import { IUser } from "@repo/domain";

export const authenticatorFactory: AuthenticatorFactory = (app: WebApplication) => {
  const service = app.getDependency<AuthService>(AuthService);
  return (req, res) => {
    const token = req.header("Authorization")?.replace(/Bearer\s?/i, "");
    if (!token) return null;
    const user = service.verifyJwt(token) as IUser;
    return user;
  };
};
