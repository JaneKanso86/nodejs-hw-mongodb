import Contact from '../models/contact.js';

export async function getAllContacts() {
  return await Contact.find();
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}
