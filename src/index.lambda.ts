import {Server} from '@hapi/hapi';
import {APIGatewayEvent} from 'aws-lambda';
import buildServer from './server';
import {LambdaResponse} from './lib/lambda-response';
import Config from './lib/config';

const config = Config.init();
let server: Server;

async function inject(options: any): Promise<any> {
  return await server.inject(options).then(({result}: any) => result);
}

exports.handler = async (event: APIGatewayEvent): Promise<any> => {
  if (!server) {
    server = await buildServer({config});
  }

  const options = {
    method: event.httpMethod,
    url: event.path,
    payload: event.body,
    headers: event.headers,
    validate: false
  };

  const {statusCode, payload} = (await inject(options)) as any;
  return new LambdaResponse(statusCode, {body: payload});
};
