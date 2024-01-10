import { WebApplication } from "@repo/lib/src/webapp";
import { AuthService } from "./services/AuthService";
import { AuthorizationError } from "@repo/lib/src/utils/errors";
import { AuthenticatorFactory } from "@repo/lib/src/webapp/types";
import { IUser } from "@repo/domain/src/entities/IUser";

export const authenticatorFactory : AuthenticatorFactory = (app : WebApplication) => {
  const service = app.getDependency<AuthService>(AuthService);
  return (req, res) => {
    const token = req.header("Authorization")?.replace(/Bearer\s?/i, "");
    if (!token) return null;
    const user = service.verifyJwt(token) as IUser;
    return user;
  };
}