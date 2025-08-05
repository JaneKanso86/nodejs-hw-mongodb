import createHttpError from 'http-errors';
import { uploadToCloudinary } from '../utils/cloudinary.js';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  replaceContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user.id;

  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const contact = await getContactById(req.params.id, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  try {
    let photoUrl = '';

    if (req.file) {
      photoUrl = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
      );
    }

    const contact = await createContact({
      ...req.body,
      userId: req.user.id,
      ...(photoUrl && { photo: photoUrl }), // якщо є
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const userId = req.user.id;

    let updatedData = { ...req.body };

    if (req.file) {
      const photoUrl = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
      );
      updatedData.photo = photoUrl;
    }

    const updatedContact = await updateContact(contactId, updatedData, userId);

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const result = await deleteContact(req.params.id, req.user.id);

    if (result === null) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const replaceContactController = async (req, res) => {
  const { value, updateExisting } = await replaceContact(
    req.params.id,
    req.body,
    req.user.id,
  );

  if (updateExisting === true) {
    return res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: value,
  });
};
export const updateContactPhoto = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  if (!req.file) {
    throw createHttpError(400, 'No file uploaded');
  }

  const photoUrl = await uploadToCloudinary(
    req.file.buffer,
    req.file.originalname,
  );

  const updatedContact = await updateContact(
    contactId,
    { photo: photoUrl },
    userId,
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Photo updated successfully',
    data: updatedContact,
  });
};
