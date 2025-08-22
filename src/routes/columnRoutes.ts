import express from 'express';
import { createColumn, updateColumn, deleteColumn } from '../controllers/ColumnController.js';
import { userOnly } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/boards/:boardId/columns', userOnly, createColumn);
router.put('/:columnId', userOnly, updateColumn);
router.delete('/:columnId', userOnly, deleteColumn);

export default router;