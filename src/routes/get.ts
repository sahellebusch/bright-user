import Joi from '@hapi/joi';
import {ServerRoute} from '@hapi/hapi';
import failAction from '../lib/fail-action';
import selectUserByEmail from '../handler/select-user';

/* eslint-disable */
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().required(),
  username: Joi.string().alphanum().min(3).required()
});

const emailSchema =Joi.string();
/* eslint-enable */

const getByEmail: ServerRoute = {
  method: 'GET',
  path: '/user/{email}',
  options: {
    auth: false,
    handler: selectUserByEmail,
    description: 'Get user by email.',
    notes: 'Returns a user.',
    tags: ['api'],
    response: {
      schema: userSchema
    },
    cors: {
      origin: ['*']
    },
    validate: {
      failAction,
      params: {
        email: emailSchema
      }
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
};

export default getByEmail;
