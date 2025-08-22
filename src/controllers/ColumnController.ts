import type { Request, Response } from "express";
import Column from "../models/ColumnSchema.js";
import Task from "../models/TaskSchema.js";
import Board from "../models/BoardSchema.js";
import StatusCode from "../Config/StatusCode.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createColumn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { name, color } = req.body;

    if (!name?.trim()) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Column name is required" });
      return;
    }

    const board = await Board.findById(boardId);
    if (!board) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Board not found" });
      return;
    }

    const isMember = board.members.some(
      (member) => member.toString() === req.user?.id
    );
    if (!isMember) {
      res.status(StatusCode.FORBIDDEN).json({ message: "Access denied" });
      return;
    }

    const columnCount = await Column.countDocuments({ board: boardId });

    const column = new Column({
      name: name.trim(),
      board: boardId,
      order: columnCount,
      color: color || "#6B7280",
    });

    await column.save();

    board.columns.push(column._id);
    await board.save();

    res.status(StatusCode.CREATED).json({
      message: "Column created successfully",
      column,
    });
  } catch (error) {
    console.error("Create column error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Error creating column",
    });
  }
};

export const updateColumn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { columnId } = req.params;
    const { name, color } = req.body;

    const column = await Column.findById(columnId).populate("board");
    if (!column) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Column not found" });
      return;
    }

    const updateData: any = {};
    if (name?.trim()) updateData.name = name.trim();
    if (color) updateData.color = color;

    const updatedColumn = await Column.findByIdAndUpdate(columnId, updateData, {
      new: true,
    });

    res.status(StatusCode.OK).json({
      message: "Column updated successfully",
      column: updatedColumn,
    });
  } catch (error) {
    console.error("Update column error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Error updating column",
    });
  }
};

export const deleteColumn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { columnId } = req.params;

    const column = await Column.findById(columnId).populate("board");
    if (!column) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Column not found" });
      return;
    }

    await Task.deleteMany({ column: columnId });

    await Board.findByIdAndUpdate(column.board._id, {
      $pull: { columns: columnId },
    });

    await Column.findByIdAndDelete(columnId);

    res.status(StatusCode.OK).json({ message: "Column deleted successfully" });
  } catch (error) {
    console.error("Delete column error:", error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting column",
    });
  }
};
