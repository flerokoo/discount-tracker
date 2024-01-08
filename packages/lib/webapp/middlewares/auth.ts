import { Request, Response } from 'express';
import { AuthenticationError, AuthorizationError } from '../../utils/errors.js';
import { handleError } from '../handle-error.js';
import { hasCurrentUser, setCurrentUser } from '../request-context.js';
import { Authenticator } from '../types.js';


export const createAuthenticatorMiddlware =
  (authenticator: Authenticator) =>
  (req: Request, res: Response, next: () => void) => {
    // const token = req.header('Authorization');

    // if (!token) {
    //   next();
    //   return;
    // }

    // try {
    //   const user = authenticator(token);
    //   setCurrentUser(user);
    //   next();
    // } catch (err) {
    //   handleError(new AuthenticationError('Token is not valid'), res);
    // }

    try {
      const user = authenticator(req, res);
      setCurrentUser(user);
      next();
    } catch (err) {
      handleError(new AuthenticationError('Not authenticated'), res);
    }
  };

export const checkAuth = async (req: Request, res: Response, next: () => void) => {
  if (!hasCurrentUser()) {
    handleError(new AuthorizationError('No access token found, not authorized'), res);
    return;
  }
  next();
};
