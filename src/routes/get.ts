import Joi from '@hapi/joi';
import {ServerRoute} from '@hapi/hapi';
import failAction from '../lib/fail-action';
import selectUserByEmail from '../handler/select-user';
import {UserSchema} from '../lib/schemas';

/* eslint-disable */
const emailSchema =Joi.string(); // don't care about the domain atoms here, let them pass whatever they want
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
      schema: UserSchema
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
