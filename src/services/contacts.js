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
export async function getPaginatedContacts({
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

  const filters = {};
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
