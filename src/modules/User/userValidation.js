import Joi from 'joi';

export const createUserValidation = Joi.object({
  firstName: Joi.string().min(3).max(8).required(),
  lastName: Joi.string().min(3).max(8).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  handler: Joi.string().required(),
  password: Joi.string().required(),
  //   .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  jobTitle: Joi.string(),
  bio: Joi.string(),
  experience: Joi.string(),
  hourlyRate: Joi.number(),
  phone: Joi.string(),
  country: Joi.string(),
});
