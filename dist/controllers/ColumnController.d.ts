import type { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const createColumn: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateColumn: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteColumn: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=ColumnController.d.ts.map