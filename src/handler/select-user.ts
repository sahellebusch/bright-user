import Promise from 'bluebird';
import {Request, Util} from '@hapi/hapi';
import {serverMethods} from '../server';
import Boom from '@hapi/boom';
import {User} from '../types';

const SELECT_BY_EMAIL = `
  SELECT
    name,
    phone,
    email,
    username
  FROM "user"
  WHERE email = $[email]
`;

export default function selectUserByEmail(request: Request): Promise<User> {
  const methods = serverMethods(request);
  const connection = methods.connection();
  const logger = methods.logger();

  const {email} = request.params as Util.Dictionary<string>;

  return Promise.resolve(
    connection
      .oneOrNone(SELECT_BY_EMAIL, {email})
      .then(user => {
        if (!user) {
          return Boom.notFound(`User with email "${email}" not found`);
        }

        return user;
      })
      .catch(error => {
        logger.error('Error retrieving user by email', {error});
        return Boom.internal('Error occurred retrieving user by email');
      })
  );
}
