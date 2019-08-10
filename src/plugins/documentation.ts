import {Server} from '@hapi/hapi';
import swagger from 'hapi-swagger';
import inert from '@hapi/inert';
import vision from '@hapi/vision';

const packageInfo = require('../../package'); /* eslint-disable-line */

const swaggerPlugin: any = {
  plugin: swagger,
  options: {
    info: {
      title: 'Vanguard',
      version: packageInfo.version
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};

export default {
  name: 'documentation',
  version: packageInfo.version,
  register: (server: Server) => server.register([inert, vision, swaggerPlugin])
};
