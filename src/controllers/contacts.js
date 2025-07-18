import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filters = {};
  if (type) filters.contactType = type;
  if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

  const result = await contactsService.getPaginatedContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const newContact = await contactsService.createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactById = async (req, res) => {
  const { contactId } = req.params;

  const updatedContact = await contactsService.updateContactById(
    contactId,
    req.body,
  );

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await contactsService.deleteContactById(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
