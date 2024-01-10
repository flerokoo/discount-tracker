import { AsyncLocalStorage } from "async_hooks";
import { IUser } from "@repo/domain/src/entities/IUser";
import { AuthorizationError } from "../utils/errors";

export type RequestContext = {
  user?: IUser;
};

const contextStorage = new AsyncLocalStorage<RequestContext>();

export function runRequestWithinContext(context: RequestContext, fn: () => unknown) {
  contextStorage.run(context, fn);
}

export function hasCurrentUser(): boolean {
  return Boolean(contextStorage.getStore()?.user);
}

export function getCurrentUser(): IUser {
  const user = contextStorage.getStore()?.user;
  if (!user) throw new AuthorizationError('No user');
  return user as IUser;
}

export function setCurrentUser(user: IUser) {
  const store = contextStorage.getStore() as RequestContext;
  store.user = user;
}
