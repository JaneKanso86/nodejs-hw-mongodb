import Contact from '../models/contact.js';

export async function getAllContacts(userId) {
  return await Contact.find({ userId });
}

export async function getContactById(contactId, userId) {
  return await Contact.findOne({ _id: contactId, userId });
}

export async function createContact(contactData) {
  return await Contact.create(contactData);
}

export async function updateContactById(contactId, data, userId) {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteContactById(contactId, userId) {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
}

export async function getPaginatedContacts({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) {
  const limit = parseInt(perPage, 10);
  const skip = (parseInt(page, 10) - 1) * limit;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy]: sortDirection };

  const filters = { userId };
  if (type) filters.contactType = type;
  if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filters);
  const contacts = await Contact.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalItems / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page: parseInt(page, 10),
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}
