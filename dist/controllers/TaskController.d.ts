import type { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const createTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTaskById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTasksByColumn: (req: AuthRequest, res: Response) => Promise<void>;
export declare const moveTask: (req: AuthRequest, res: Response) => Promise<void>;
export declare const reorderTasks: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=TaskController.d.ts.map