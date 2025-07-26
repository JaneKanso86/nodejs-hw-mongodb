import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContactById,
  deleteContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactsSchemas.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactById),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactById));

export default router;
