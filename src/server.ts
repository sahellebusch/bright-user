import Promise from 'bluebird';
import hapi, {Request, Server} from '@hapi/hapi';
import Config from './lib/config';
import {Logger} from './lib/logger';
import routes from './routes';
import methods from './plugins/methods';
import logging from './plugins/logging';
import documentation from './plugins/documentation'; // for local documentation
import {IDatabase} from 'pg-promise';

export interface IServerMethods {
  logger(): Logger;
  connection(): IDatabase<unknown>;
}

export function serverMethods(request: Request): IServerMethods {
  return request.server.methods as any;
}

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

interface ServerOpts {
  config: Config;
  serverLogs?: boolean;
  providedLogger?: Logger;
  providedConnection?: IDatabase<unknown>;
}

export default function buildServer(serverOpts: ServerOpts): Promise<Server> {
  const {config, providedLogger, providedConnection, serverLogs = true} = serverOpts;

  const server = new hapi.Server({
    host,
    port
  });

  const plugins = [
    {plugin: methods, options: {logger: providedLogger, connection: providedConnection, config}},
    {plugin: logging, options: {serverLogs}},
    documentation
  ];

  return Promise.map(plugins, plugin => server.register(plugin as any))
    .then(() => server.route(routes))
    .then(() => server);
}
