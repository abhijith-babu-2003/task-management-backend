import express from 'express';
import { createTask, updateTask, moveTask, deleteTask, getTasksByColumn, reorderTasks } from '../controllers/TaskController.js';
import { userOnly } from '../Middleware/authMiddleware.js';
const router = express.Router();
router.post('/columns/:columnId/tasks', userOnly, createTask);
router.get('/columns/:columnId/tasks', userOnly, getTasksByColumn);
router.put('/tasks/:taskId', userOnly, updateTask);
router.put('/tasks/:taskId/move', userOnly, moveTask);
router.delete('/tasks/:taskId', userOnly, deleteTask);
router.put('/columns/:columnId/tasks/reorder', userOnly, reorderTasks);
export default router;
//# sourceMappingURL=taskRoutes.js.map