import express from 'express';
import { 
  createBoard, 
  getBoards, 
  getBoardById, 
  updateBoard, 
  deleteBoard, 
} from '../controllers/BoardController.js';
import { userOnly } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/', userOnly, createBoard);
router.get('/', userOnly, getBoards);
router.get('/:boardId', userOnly, getBoardById);
router.put('/:boardId', userOnly, updateBoard);
router.delete('/:boardId', userOnly, deleteBoard);


export default router;