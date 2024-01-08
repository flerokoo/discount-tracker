import { Request, Response } from 'express';
export declare function adaptRouteForExpress(handler: (req: Request, res: Response) => Promise<void>): (req: Request, res: Response, next: () => void) => Promise<void>;
//# sourceMappingURL=adapt-route-for-express.d.ts.map