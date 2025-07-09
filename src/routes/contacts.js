import express from 'express';
import { getContacts, getContact } from '../controllers/contacts.js';

const router = express.Router();

router.get('/', (req, res) => res.send('Contacts list'));
router.get('/:contactId', (req, res) =>
  res.send(`Contact ${req.params.contactId}`),
);
export default router;
