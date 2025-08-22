import type { Request, Response } from "express";
import Board, { type IBoard } from "../models/BoardSchema.js";
import Column from "../models/ColumnSchema.js";
import Task from "../models/TaskSchema.js";
import BoardInvite, { type IBoardInvite } from "../models/BoardInviteSchema.js";
import mongoose, { Types } from "mongoose";
import StatusCode from "../Config/StatusCode.js";

interface IBoardMember {
  _id: Types.ObjectId;
  username?: string;
  email?: string;
  avatar?: string;
}

interface IColumnForBoard {
  _id: Types.ObjectId;
  name: string;
  color: string;
  order: number;
  tasks: Types.ObjectId[];
}

interface IPopulatedBoard
  extends Omit<IBoard, "members" | "owner" | "columns"> {
  members: IBoardMember[];
  owner: IBoardMember;
  columns: IColumnForBoard[];
}

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createBoard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  if (!name?.trim()) {
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: "Board name is required" });
    return;
  }

  if (!req.user?.id) {
    res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: "User authentication required" });
    return;
  }

  try {
    const board = new Board({
      name: name.trim(),
      owner: new Types.ObjectId(req.user.id),
      members: [new Types.ObjectId(req.user.id)],
      columns: [],
    });

    const savedBoard = await board.save();

    const defaultColumns = [
      { name: "To Do", color: "#EF4444" },
      { name: "In Progress", color: "#F59E0B" },
      { name: "Done", color: "#10B981" },
    ];

    const columnsToInsert = defaultColumns.map((col, index) => ({
      name: col.name,
      board: savedBoard._id,
      order: index,
      color: col.color,
      tasks: [],
    }));

    const columns = await Column.insertMany(columnsToInsert);

    savedBoard.columns = columns.map((col) => col._id);
    await savedBoard.save();

    const populatedBoard = (await Board.findById(savedBoard._id)
      .populate<{ columns: IColumnForBoard[] }>({
        path: "columns",
        select: "name color order tasks",
        options: { sort: { order: 1 } },
      })
      .populate<{ owner: IBoardMember }>("owner", "username email")
      .populate<{ members: IBoardMember[] }>("members", "username email")
      .lean()) as unknown as IPopulatedBoard;

    if (!populatedBoard) {
      throw new Error("Failed to retrieve created board");
    }

    const responseData = {
      ...populatedBoard,
      members: populatedBoard.members.map((member) => ({
        _id: member._id,
        username: member.username || "",
        email: member.email || "",
      })),
    };

    res.status(StatusCode.CREATED).json(responseData);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Column")) {
      try {
        await Board.findOneAndDelete({
          owner: req.user?.id,
          createdAt: { $gte: new Date(Date.now() - 5000) },
          columns: { $size: 0 },
        });
      } catch {}
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorDetails = {
      message: "Error creating board",
      error: errorMessage,
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      }),
    };

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorDetails);
  }
};

export const getBoards = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "User authentication required" });
      return;
    }

    const boards = await Board.find({ members: req.user.id })
      .populate("columns")
      .populate("members", "username email avatar")
      .populate("owner", "username email avatar")
      .sort({ updatedAt: -1 });

    res.status(StatusCode.OK).json({ boards });
  } catch {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching boards" });
  }
};

export const getBoardById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { boardId } = req.params;

    if (!req.user?.id) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "User authentication required" });
      return;
    }

    const board = await Board.findById(boardId)
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          populate: [
            { path: "assignedTo", select: "username email avatar" },
            { path: "createdBy", select: "username email avatar" },
          ],
        },
      })
      .populate("members", "username email avatar")
      .populate("owner", "username email avatar");

    if (!board) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Board not found" });
      return;
    }

    res.status(StatusCode.OK).json({ board });
  } catch {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching board" });
  }
};

export const updateBoard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    if (!req.user?.id) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "User authentication required" });
      return;
    }

    const board = await Board.findById(boardId);

    if (!board) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Board not found" });
      return;
    }

    const updateData: any = {};
    if (name?.trim()) updateData.name = name.trim();

    const updatedBoard = await Board.findByIdAndUpdate(boardId, updateData, {
      new: true,
    })
      .populate("members", "username email avatar")
      .populate("owner", "username email avatar");

    res.status(StatusCode.OK).json({
      message: "Board updated successfully",
      board: updatedBoard,
    });
  } catch {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating board" });
  }
};

export const deleteBoard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { boardId } = req.params;

    if (!req.user?.id) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "User authentication required" });
      return;
    }

    const board = await Board.findById(boardId);

    if (!board) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Board not found" });
      return;
    }

    if (board.owner.toString() !== req.user.id) {
      res
        .status(StatusCode.FORBIDDEN)
        .json({ message: "Only board owner can delete the board" });
      return;
    }

    await Task.deleteMany({ board: new Types.ObjectId(boardId) });
    await Column.deleteMany({ board: new Types.ObjectId(boardId) });
    await BoardInvite.deleteMany({ board: new Types.ObjectId(boardId) });
    await Board.findByIdAndDelete(boardId);

    res.status(StatusCode.OK).json({ message: "Board deleted successfully" });
  } catch {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting board" });
  }
};
