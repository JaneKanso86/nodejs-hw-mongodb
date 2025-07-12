import express from 'express';
import { getContacts, getContact,
  createContact,
  updateContactById,
  deleteContactById } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts);
router.get('/:contactId', ctrlWrapper(getContact));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(updateContactById));
router.delete('/:contactId', ctrlWrapper(deleteContactById));

export default router;
