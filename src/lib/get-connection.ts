import {IDatabase} from 'pg-promise';
import pgp from './pgp';
import * as AWS from 'aws-sdk';
import {NodeEnvs} from './constants';
import Config from './config';

const secretsManager = new AWS.SecretsManager();

export default function(config: Config): Promise<IDatabase<unknown>> {
  const nodeEnv = config.get('NODE_ENV');

  if (nodeEnv === NodeEnvs.DEV || nodeEnv === NodeEnvs.DOCKER) {
    return Promise.resolve(pgp(config.get('DB_URL')));
  }

  const secretsNamespace = config.get('SECRETS_NAMESPACE');

  // Construct paramaters to pass to AWS Secrets Manager API call
  // SecretId is a combination of the secret's namespace and the specific secret to return
  const params = {
    SecretId: secretsNamespace + 'db_url'
  };

  // AWS Secrets Manager API call passing through params for retrieval
  return secretsManager
    .getSecretValue(params)
    .promise()
    .then(({SecretString}) => {
      if (SecretString) {
        return pgp(SecretString);
      }

      throw new Error('Failed to retrieve secret!');
    });
}
