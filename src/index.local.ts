import {Server} from '@hapi/hapi';
import buildServer from './server';
import Config from './lib/config';

const config = Config.init();
let server: Server;

buildServer({config}).then(newServer => {
  server = newServer;
  return server.start().then(() => {
    console.log(`Server listening at ${server.info.uri}`);
  });
});
