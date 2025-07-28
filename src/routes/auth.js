import express from 'express';
import { register, login, logout, refresh } from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerSchema } from '../validation/authSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));

router.post('/login', validateBody(loginSchema), ctrlWrapper(login));

router.post('/refresh', ctrlWrapper(refresh));

router.post('/logout', authenticate, ctrlWrapper(logout));

export default router;
