import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, `Invalid format ID: ${contactId}`));
  }

  next();
};
