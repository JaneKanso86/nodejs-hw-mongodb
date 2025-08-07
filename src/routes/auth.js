import express from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUser,
  registerUser,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/authSchemas.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  sendResetEmail,
  registerUserController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUser),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUser),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserController));

router.post(
  '/send-reset-email',

  validateBody(resetEmailSchema),
  ctrlWrapper(sendResetEmail),
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
