import { Request, Response } from 'express';
import { AuthenticationError, AuthorizationError } from '../../utils/errors.js';
import { handleError } from '../handle-error.js';
import { hasCurrentUser, setCurrentUser } from '../request-context.js';
import { Authenticator } from '../types.js';


export const createAuthenticatorMiddlware =
  (authenticator: Authenticator) =>
  (req: Request, res: Response, next: () => void) => {
    try {
      const user = authenticator(req, res);
      if (user) setCurrentUser(user);
    } catch (err) {
      // skip jsonwebtoken error
      // todo refactor
    } finally {
      next();
    }
  };

export const checkAuth = async (req: Request, res: Response, next: () => void) => {
  if (!hasCurrentUser()) {
    handleError(new AuthorizationError('No access token found, not authorized'), res);
    return;
  }
  next();
};
