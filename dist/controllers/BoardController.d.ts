import type { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const createBoard: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBoards: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBoardById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBoard: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBoard: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=BoardController.d.ts.map