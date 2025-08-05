import express from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  replaceContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactShema,
  updateContactShema,
} from '../validation/contactsSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/upload.js';
import { auth } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', auth, ctrlWrapper(getContactsController));

router.get('/:id', auth, isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  auth,
  upload.single('photo'),
  validateBody(createContactShema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id/photo',
  auth,
  isValidId,
  upload.single('photo'),
  validateBody(updateContactShema),
  ctrlWrapper(updateContactController),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

router.put(
  '/:id',
  auth,
  isValidId,
  validateBody(createContactShema),
  ctrlWrapper(replaceContactController),
);

export default router;
