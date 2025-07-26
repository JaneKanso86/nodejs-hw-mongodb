import express from 'express';
import { loginUser } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema } from '../validation/authSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { logout } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSession));
router.post('/logout', authenticate, logout);
export default router;
