import Joi from 'joi';

export const createAdminValidation = Joi.object({
  firstName: Joi.string().min(3).max(8).required(),
  lastName: Joi.string().min(3).max(8).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  password: Joi.string(),
  //   .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
