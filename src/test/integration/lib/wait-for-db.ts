import Promise from 'bluebird';
import {IDatabase} from 'pg-promise';
import logger from '../../../lib/logger';
import retry, {Options as BluebirdRetryOpts} from 'bluebird-retry';

const HEALTH_CHECK = 'SELECT 1';

export default function waitForDB(connection: IDatabase<unknown>): Promise<null> {
  const maxRetries = 20;
  let count = 0;

  const checkHealth = (): Promise<null> =>
    Promise.resolve(connection.one(HEALTH_CHECK)).catch(error => {
      count++;
      logger.warn(`Database health-check failed ${count}/${maxRetries} times.`, {
        error
      });

      throw error;
    });

  const retryOptions: BluebirdRetryOpts = {
    interval: 1000,
    backoff: 2,
    max_tries: maxRetries // eslint-disable-line @typescript-eslint/camelcase
  };

  return retry(checkHealth, retryOptions);
}
