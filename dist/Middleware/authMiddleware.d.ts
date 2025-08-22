import type { Request, Response, NextFunction } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const userOnly: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map