import Contact from '../models/contact.js';

export async function getAllContacts() {
  return await Contact.find();
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export async function createContact(contactData) {
  return await Contact.create(contactData);
}

export async function updateContactById(contactId, data) {
  return await Contact.findByIdAndUpdate(contactId, data, {
    new: true,
    runValidators: true,
  });
}
export async function deleteContactById(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}
