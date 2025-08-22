import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
} from '../controllers/UserController.js';
import { userOnly } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', userOnly, getCurrentUser);


export default router;
