import {Server} from '@hapi/hapi';
import httpStatus from 'http-status-codes';
import buildServer from '../../../server';
import mockLogger from '../lib/mock-logger';
import Config from '../../../lib/config';
import getConnection from '../../../lib/get-connection';
import waitForDb from '../lib/wait-for-db';

const env = {
  DB_URL: 'postgres://root:123@postgres/user'
};

const config = Config.init(env);

const connection = getConnection(config.get('DB_URL'));

describe('/status', () => {
  let server: Server;

  beforeAll(() =>
    buildServer({
      config,
      providedLogger: mockLogger,
      providedConnection: connection
    })
      .then(srv => {
        server = srv;
      })
      .then(() => waitForDb(connection))
  );

  it(`responds 'ok' when the service is healthy`, () =>
    server
      .inject({
        method: 'GET',
        url: '/status'
      })
      .then(({statusCode, result: response}) => {
        expect(statusCode).toEqual(httpStatus.OK);
        expect(response).toEqual({status: 'Ok'});
      }));
});
