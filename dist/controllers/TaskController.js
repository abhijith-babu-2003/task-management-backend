import Task, {} from "../models/TaskSchema.js";
import Column from "../models/ColumnSchema.js";
import Board from "../models/BoardSchema.js";
import StatusCode from "../Config/StatusCode.js";
import { Types } from "mongoose";
import mongoose from "mongoose";
export const createTask = async (req, res) => {
    try {
        const { columnId } = req.params;
        const { title, description, priority, dueDate, tags, assignedTo } = req.body;
        if (!title?.trim()) {
            res
                .status(StatusCode.BAD_REQUEST)
                .json({ message: "Task title is required" });
            return;
        }
        if (!columnId || !mongoose.Types.ObjectId.isValid(columnId)) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Invalid columnId" });
            return;
        }
        const column = await Column.findById(columnId).populate("board");
        if (!column) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Column not found" });
            return;
        }
        const taskCount = await Task.countDocuments({ column: columnId });
        const task = new Task({
            title: title.trim(),
            description: description || "",
            column: columnId,
            board: column.board._id,
            priority: priority || "medium",
            dueDate: dueDate ? new Date(dueDate) : undefined,
            tags: tags || [],
            assignedTo: assignedTo || [],
            order: taskCount,
            createdBy: req.user?.id,
            comments: [],
        });
        await task.save();
        column.tasks.push(task._id);
        await column.save();
        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email avatar")
            .populate("createdBy", "name email avatar");
        res.status(StatusCode.CREATED).json({
            message: "Task created successfully",
            task: populatedTask,
        });
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error creating task",
        });
    }
};
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, priority, dueDate, tags, assignedTo } = req.body;
        const task = await Task.findById(taskId).populate("board");
        if (!task) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Task not found" });
            return;
        }
        const updateData = {};
        if (title?.trim())
            updateData.title = title.trim();
        if (description !== undefined)
            updateData.description = description;
        if (priority)
            updateData.priority = priority;
        if (dueDate !== undefined)
            updateData.dueDate = dueDate ? new Date(dueDate) : undefined;
        if (tags !== undefined)
            updateData.tags = tags;
        if (assignedTo !== undefined)
            updateData.assignedTo = assignedTo;
        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
            new: true,
        })
            .populate("assignedTo", "name email avatar")
            .populate("createdBy", "name email avatar");
        res.status(StatusCode.OK).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        console.error("Update task error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error updating task",
        });
    }
};
export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId)
            .populate("assignedTo", "name email avatar")
            .populate("createdBy", "name email avatar")
            .populate({
            path: "board",
            populate: { path: "members", select: "name email avatar" },
        });
        if (!task) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Task not found" });
            return;
        }
        res.status(StatusCode.OK).json({
            task: {
                ...task.toObject(),
                comments: task.comments.map((comment) => ({
                    ...comment,
                    createdBy: task.populated("createdBy"),
                })),
            },
        });
    }
    catch (error) {
        console.error("Get task error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error fetching task",
        });
    }
};
export const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;
        if (!text?.trim()) {
            res
                .status(StatusCode.BAD_REQUEST)
                .json({ message: "Comment text is required" });
            return;
        }
        const task = await Task.findById(taskId).populate("board");
        if (!task) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Task not found" });
            return;
        }
        const comment = {
            user: new mongoose.Types.ObjectId(req.user?.id),
            content: text.trim(),
            createdAt: new Date(),
        };
        task.comments.push(comment);
        await task.save();
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email avatar")
            .populate("createdBy", "name email avatar")
            .populate({
            path: "comments.user",
            select: "name email avatar",
        });
        const addedComment = updatedTask?.comments[updatedTask.comments.length - 1];
        res.status(StatusCode.CREATED).json({
            message: "Comment added successfully",
            comment: addedComment,
        });
    }
    catch (error) {
        console.error("Add comment error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error adding comment",
        });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate("board");
        if (!task) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Task not found" });
            return;
        }
        await Column.findByIdAndUpdate(task.column, { $pull: { tasks: taskId } });
        await Task.findByIdAndDelete(taskId);
        res.status(StatusCode.OK).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error deleting task",
        });
    }
};
export const getTasksByColumn = async (req, res) => {
    try {
        const { columnId } = req.params;
        const column = await Column.findById(columnId).populate("board");
        if (!column) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Column not found" });
            return;
        }
        const tasks = await Task.find({ column: columnId })
            .populate("assignedTo", "name email avatar")
            .populate("createdBy", "name email avatar")
            .sort({ order: 1 });
        res.status(StatusCode.OK).json({ tasks });
    }
    catch (error) {
        console.error("Get tasks error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error fetching tasks",
        });
    }
};
export const moveTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { newColumnId, newOrder } = req.body;
        const task = await Task.findById(taskId).populate("board");
        if (!task) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Task not found" });
            return;
        }
        const newColumn = await Column.findById(newColumnId);
        if (!newColumn) {
            res
                .status(StatusCode.NOT_FOUND)
                .json({ message: "Target column not found" });
            return;
        }
        const oldColumn = await Column.findById(task.column);
        if (oldColumn) {
            oldColumn.tasks = oldColumn.tasks.filter((id) => id.toString() !== taskId);
            await oldColumn.save();
        }
        newColumn.tasks.push(task._id);
        await newColumn.save();
        task.column = newColumnId;
        task.order = newOrder ?? newColumn.tasks.length - 1;
        await task.save();
        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email avatar")
            .populate("createdBy", "name email avatar");
        res.status(StatusCode.OK).json({
            message: "Task moved successfully",
            task: populatedTask,
        });
    }
    catch (error) {
        console.error("Move task error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error moving task",
        });
    }
};
export const reorderTasks = async (req, res) => {
    try {
        const { columnId } = req.params;
        const { taskIds } = req.body;
        const column = await Column.findById(columnId).populate("board");
        if (!column) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Column not found" });
            return;
        }
        const updatePromises = taskIds.map((taskId, index) => Task.findByIdAndUpdate(taskId, { order: index }));
        await Promise.all(updatePromises);
        column.tasks = taskIds;
        await column.save();
        res.status(StatusCode.OK).json({ message: "Tasks reordered successfully" });
    }
    catch (error) {
        console.error("Reorder tasks error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error reordering tasks",
        });
    }
};
//# sourceMappingURL=TaskController.js.map