import Promise from 'bluebird';
import {Server} from '@hapi/hapi';
import httpStatus from 'http-status-codes';
import buildServer from '../../../server';
import mockLogger from '../lib/mock-logger';
import Config from '../../../lib/config';
import getConnection from '../../../lib/get-connection';
import waitForDb from '../lib/wait-for-db';
import {IDatabase} from 'pg-promise';

const env = {
  NODE_ENV: 'dev',
  DB_URL: 'postgres://root:123@postgres/user'
};

const config = Config.init(env);

const connection = getConnection(config.get('DB_URL'));

describe('/post', () => {
  let server: Server;
  let insertedUserId: number;

  beforeAll(() =>
    buildServer({
      config,
      providedLogger: mockLogger,
      providedConnection: connection,
      serverLogs: false
    })
      .then(srv => {
        server = srv;
      })
      .then(() => waitForDb(connection))
  );

  afterEach(() => connection.none(`DELETE FROM "user" WHERE id = ${insertedUserId}`));

  test('returns the id of a newly inserted member', () => {
    const payload = {
      name: 'Homer Simpson',
      username: 'mrsimpson',
      phone: '123-456-7890',
      email: 'mrsimpson@test.com'
    };

    return server
      .inject({
        method: 'POST',
        url: '/user',
        payload
      })
      .then(({statusCode, result: response}) => {
        expect(statusCode).toEqual(httpStatus.OK);
        expect(response).toHaveProperty('id');
        // @ts-ignore : don't care, this is a test
        expect(typeof response.id).toBe('number');

        // @ts-ignore
        insertedUserId = response.id;

        // @ts-ignore
        return connection.one(`SELECT * FROM "user" WHERE id = ${response.id}`).then(result => {
          expect(result.name).toEqual(payload.name);
          expect(result.username).toEqual(payload.username);
          expect(result.email).toEqual(payload.email);
          expect(result.phone).toEqual(payload.phone);
        });
      });
  });

  test('will return a 409 when the user already exists', () => {
    const payload = {
      name: 'Homer Simpson',
      phone: '123-456-7890',
      username: 'mrsimpson',
      email: 'mrsimpson@test'
    };

    return server.inject({
      method: 'POST',
      url: '/user',
      payload
    });
  });

  test('will return a 400 with no name', () => {
    const payload = {
      username: 'mrsimpson',
      phone: '123-456-7890',
      email: 'mrsimpson@test.com'
    };

    return server
      .inject({
        method: 'POST',
        url: '/user',
        payload
      })
      .then(({statusCode}) => {
        expect(statusCode).toEqual(httpStatus.BAD_REQUEST);
      });
  });

  test('will return a 400 with no username', () => {
    const payload = {
      name: 'Homer Simpson',
      phone: '123-456-7890',
      email: 'mrsimpson@test.com'
    };

    return server
      .inject({
        method: 'POST',
        url: '/user',
        payload
      })
      .then(({statusCode}) => {
        expect(statusCode).toEqual(httpStatus.BAD_REQUEST);
      });
  });

  test('will return a 400 with username less than 3 chars', () => {
    const payload = {
      name: 'Homer Simpson',
      username: 'a',
      phone: '123-456-7890',
      email: 'mrsimpson@test.com'
    };

    return server
      .inject({
        method: 'POST',
        url: '/user',
        payload
      })
      .then(({statusCode}) => {
        expect(statusCode).toEqual(httpStatus.BAD_REQUEST);
      });
  });

  test('will return a 400 with no email', () => {
    const payload = {
      name: 'Homer Simpson',
      phone: '123-456-7890',
      username: 'mrsimpson'
    };

    return server
      .inject({
        method: 'POST',
        url: '/user',
        payload
      })
      .then(({statusCode}) => {
        expect(statusCode).toEqual(httpStatus.BAD_REQUEST);
      });
  });

  test('will return a 400 with invalid email', () => {
    const payload = {
      name: 'Homer Simpson',
      phone: '123-456-7890',
      username: 'mrsimpson',
      email: 'mrsimpson@test' // needs 2 domain segments
    };

    return server
      .inject({
        method: 'POST',
        url: '/user',
        payload
      })
      .then(({statusCode}) => {
        expect(statusCode).toEqual(httpStatus.BAD_REQUEST);
      });
  });

  test('will return a 500 level error upon failure to inser', () => {
    const mockConnection = {
      one: () => Promise.reject(new Error('BOOM'))
    };

    const payload = {
      name: 'Homer Simpson',
      username: 'mrsimpson',
      phone: '123-456-7890',
      email: 'mrsimpson@test.com'
    };

    return buildServer({
      config,
      providedLogger: mockLogger,
      providedConnection: (mockConnection as unknown) as IDatabase<unknown>,
      serverLogs: false
    }).then((srv: Server) =>
      srv
        .inject({
          method: 'POST',
          url: '/user',
          payload
        })
        .then(({statusCode}) => {
          expect(statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
        })
    );
  });
});
