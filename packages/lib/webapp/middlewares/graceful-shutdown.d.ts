import { Request, Response } from 'express';
import type GracefulShutdownHandler from '@flerokoo/graceful-shutdown-handler';
export declare function createGracefulShutdownMiddleware(handler: GracefulShutdownHandler): (req: Request, res: Response, next: () => void) => void;
//# sourceMappingURL=graceful-shutdown.d.ts.map