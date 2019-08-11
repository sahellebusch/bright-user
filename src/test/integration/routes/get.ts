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
const testUsers = [
  {
    name: 'marge',
    username: 'mrssimpson',
    email: 'mrssimpson@test.com',
    phone: '123-456-7890'
  },
  {
    name: 'bart',
    username: 'bartrsimpson',
    email: 'bartsimpson@test.com',
    phone: '123-456-7890'
  }
];

function insertTestUsers(): Promise<any> {
  const sql = `
    INSERT INTO "user"(name, phone, username, email)
    VALUES ($[name], $[phone], $[username], $[email])
`;

  return Promise.all(testUsers.map(user => connection.none(sql, user)));
}

describe('/post', () => {
  let server: Server;

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
      .then(insertTestUsers)
  );

  afterAll(() =>
    connection.none(
      `DELETE FROM "user" WHERE email IN ('${testUsers[0].email}','${testUsers[1].email}')`
    )
  );

  test('returns a 200 with the user upon success', () =>
    server.inject(`/user/${testUsers[0].email}`).then(({statusCode}) => {
      expect(statusCode).toEqual(httpStatus.OK);
    }));

  test('responds with 404 if the email is not valid', () =>
    server.inject('/user/boom@roasted.com').then(({statusCode}) => {
      expect(statusCode).toEqual(httpStatus.NOT_FOUND);
    }));

  test('responds with a 500 error upon database failure', () => {
    const mockConnection = {
      oneOrNone: () => Promise.reject(new Error('BOOM'))
    };

    return buildServer({
      config,
      providedLogger: mockLogger,
      providedConnection: (mockConnection as unknown) as IDatabase<unknown>,
      serverLogs: false
    }).then(srv => {
      srv.inject('/user/boom@roasted.com').then(({statusCode}) => {
        expect(statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
