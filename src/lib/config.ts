import Joi, {Schema as JoiSchema} from '@hapi/joi';
import pick from 'lodash/pick';
import logger from './logger';

interface EnvironmentVars {
  [key: string]: any;
}

export default class Config {
  /* eslint-disable */
  static readonly apiConfigSchema: JoiSchema = Joi.object( {
    DB_URL: Joi.string().uri().required()
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
