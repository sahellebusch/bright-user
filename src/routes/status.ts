import {ServerRoute} from '@hapi/hapi';
import {StatusCodes} from '../lib/lambda-response';

function getStatus(): any {
  return {statusCode: StatusCodes.OK};
}

const route: ServerRoute = {
  method: 'GET',
  path: '/status',
  options: {
    auth: false,
    handler: getStatus,
    description: 'Status',
    notes: 'Returns a positive status if the service is alive and healthy',
    tags: ['api', 'status'],
    cors: {
      origin: ['*']
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
      }
    }
  }
};

export default route;
