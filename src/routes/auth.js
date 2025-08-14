import express from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUser,
  registerUser,
  resetEmailSchema,
  resetPasswordSchema,
  confirmOAuthSchema,
} from '../validation/authSchemas.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  sendResetEmail,
  registerUserController,
  resetPasswordController,
  getOAuthController,
  confirmOAuthController,
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

router.get('/get-oauth-url', ctrlWrapper(getOAuthController));

router.post(
  '/confirm-oauth',
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthController),
);
console.log('POST /auth/confirm-oauth initialized');
export default router;
