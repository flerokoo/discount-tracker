import { handleError } from '../handle-error.js';
import { Request, Response } from 'express';

// wrapper for async rejections handling within express app
export function adaptRouteForExpress(handler: (req: Request, res: Response) => Promise<void>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (req: Request, res: Response, next: () => void) => {
    try {
      await handler(req, res);
    } catch (err: unknown) {
      handleError(err instanceof Error ? err : new Error(JSON.stringify(err)), res);
    }
  };
}
