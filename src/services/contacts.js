import { ContactsCollection } from '../models/contact.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
  userId,
) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const filterQuery = { userId };

  if (typeof filter.type !== 'undefined') {
    filterQuery.contactType = filter.type;
  }

  if (typeof filter.isFavourite !== 'undefined') {
    filterQuery.isFavourite = filter.isFavourite;
  }

  const contactsQuery = ContactsCollection.find(filterQuery);

  const [count, contacts] = await Promise.all([
    ContactsCollection.countDocuments(filterQuery),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(count / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    totalPages: totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const updateContact = async (contactId, payload, userId) => {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
};

export const deleteContact = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};

export const replaceContact = async (contactId, payload, userId) => {
  const updatedPayload = {
    ...payload,
    _id: contactId,
    userId,
  };
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updatedPayload,
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return {
    value: result,
    updateExisting: true,
  };
};
