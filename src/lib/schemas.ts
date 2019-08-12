import Joi from '@hapi/joi';

/* eslint-disable */
export const UserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().required(),
  username: Joi.string().min(3).required()
})
/* eslint-enable */
