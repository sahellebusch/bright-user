import Joi from '@hapi/joi';
import {ServerRoute} from '@hapi/hapi';
import failAction from '../lib/fail-action';
import insertUser from '../handler/insert-user';
import {UserSchema} from '../lib/schemas';

/* eslint-disable */
const responseSchema = Joi.object({
  id: Joi.number().min(1).required()
});
/* eslint-enable */

const route: ServerRoute = {
  method: 'POST',
  path: '/user',
  options: {
    auth: false,
    handler: insertUser,
    description: 'Create a User.',
    notes: 'Returns id of newly created user.',
    tags: ['api'],
    payload: {
      parse: true
    },
    cors: {
      origin: ['*']
    },
    validate: {
      payload: UserSchema,
      failAction
    },
    response: {
      schema: responseSchema
    },
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
        responses: {
          '201': {
            description: 'Success'
          },
          '400': {
            description: 'Invalid or missing parameter'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
};

export default route;
