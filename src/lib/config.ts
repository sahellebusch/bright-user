import Joi, {Schema as JoiSchema} from '@hapi/joi';
import pick from 'lodash/pick';
import logger from './logger';
import {NodeEnvs} from '../lib/constants';

interface EnvironmentVars {
  [key: string]: any;
}

export default class Config {
  /* eslint-disable */
  static readonly apiConfigSchema: JoiSchema = Joi.object({
    NODE_ENV: Joi.string().valid(Object.values(NodeEnvs)).required(),
    SECRETS_NAMESPACE: Joi.string().when('NODE_ENV', {
      is: Joi.string().valid(['production']),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    DB_URL: Joi.string().uri()
      .when('NODE_ENV', {
        is: Joi.string().valid(['dev', 'docker']),
        then: Joi.required(),
        otherwise: Joi.optional()
      })
  });
  /* eslint-enable */


  public static init(providedEnv?: EnvironmentVars): Config {
    const toValidate = providedEnv || process.env;

    const {error, value} = Joi.validate(toValidate, Config.apiConfigSchema, {
      abortEarly: false,
      allowUnknown: true
    });

    if (error) {
      logger.fatal('Environment variables failed validation', {error});
      throw error;
    }

    return new Config(pick(value, Object.keys(Config.apiConfigSchema.describe().children)));
  }

  readonly env: EnvironmentVars;

  private constructor(env: EnvironmentVars) {
    this.env = env;
  }

  public has(prop: string): boolean {
    return !!this.env[prop];
  }

  public get(prop: string): any {
    if (!this.env[prop]) {
      throw new Error(`Property "${prop}" does not exist `);
    }

    return this.env[prop];
  }
}
