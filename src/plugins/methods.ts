import Promise from 'bluebird';
import {Server} from '@hapi/hapi';
import {IDatabase} from 'pg-promise';
import getConnection from '../lib/get-connection';
import Config from '../lib/config';
import defaultLogger, {Logger} from '../lib/logger';

const packageInfo = require('../../package'); /* eslint-disable-line */

export interface MethodOptions {
  config: Config;
  logger: Logger;
  connection: IDatabase<{}>;
}

export default {
  name: 'methods',
  version: packageInfo.version,
  register: (server: Server, options: MethodOptions) => {
    const logger = options.logger || defaultLogger;
    const connection = options.connection || getConnection(options.config.get('DB_URL'));

    server.method('logger', (() => logger) as any);
    server.method('connection', (() => connection) as any);
    server.method('config', (() => options.config) as any);

    return Promise.resolve();
  }
};
