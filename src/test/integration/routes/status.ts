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
let connection: IDatabase<unknown>;

describe('/status', () => {
  let server: Server;

  beforeAll(() =>
    getConnection(config)
      .then(conn => {
        connection = conn;
      })
      .then(() =>
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
      )
  );

  it(`responds 'ok' when the service is healthy`, () =>
    server
      .inject({
        method: 'GET',
        url: '/status'
      })
     .then(({statusCode, result: response}) => {
       console.log(statusCode, response);
        expect(statusCode).toEqual(httpStatus.OK);
        expect(response).toEqual({statusCode: httpStatus.OK});
      }));
});
