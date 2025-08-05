import Joi from 'joi';

export const createContactShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  contactType: Joi.string().valid('work', 'personal').required(),
  isFavourite: Joi.boolean().required(),
});

export const updateContactShema = Joi.object({
  name: Joi.string().min(3).max(100),
  phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,13}$/),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
