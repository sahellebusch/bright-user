import Promise from 'bluebird';
import {Request} from '@hapi/hapi';
import {serverMethods} from '../server';
import Boom from '@hapi/boom';
import {IDatabase} from 'pg-promise';
import {Logger} from '../lib/logger';

interface UserPayload {
  email: string;
  phone: string;
  name: string;
  username: string;
}

const CHECK_EMAIL_SQL = `
  SELECT EXISTS(SELECT id FROM "user" WHERE email = $[email])
`;

const INSERT_USER_SQL = `
  INSERT INTO "user"(name, email, phone, username)
  VALUES($[name], $[email], $[phone], $[username])
  RETURNING id
`;

function checkUserExists(
  connection: IDatabase<unknown>,
  logger: Logger,
  email: string
): Promise<boolean> {
  return Promise.resolve(connection.one(CHECK_EMAIL_SQL, {email}))
    .get('exists')
    .catch(error => {
      logger.error('Failed to check if user exists by email', {error});
      throw error;
    });
}

export default function postUser(request: Request): Promise<number> {
  const methods = serverMethods(request);
  const connection = methods.connection();
  const logger = methods.logger();

  const user = request.payload as UserPayload;
  return Promise.resolve(
    checkUserExists(connection, logger, user.email).then(exists => {
      if (exists) {
        return Boom.conflict(`User with email "${user.email} already exists`);
      }

      return connection
        .one(INSERT_USER_SQL, user)
        .tap(id => ({id}))
        .catch(error => {
          logger.error('Error inserting new user', {error});
          return Boom.internal('Error occurred inserting user');
        });
    })
  );
}
