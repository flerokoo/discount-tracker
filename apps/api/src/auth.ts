import { WebApplication } from "@repo/lib/webapp";
import { AuthService } from "./services/AuthService";
import { AuthorizationError } from "@repo/lib/utils/errors";
import { AuthenticatorFactory } from "@repo/lib/webapp/types";
import { IUser } from "@repo/domain/entities/IUser";

export const authenticatorFactory : AuthenticatorFactory = (app : WebApplication) => {
  const service = app.getDependency(AuthService);
  return (req, res) => {
    const token = req.header("Authorization")?.replace(/Bearer\s?/i, "");
    if (!token) throw new AuthorizationError('No token');
    const user = service.verifyJwt(token) as IUser;
    return user;
  };
}