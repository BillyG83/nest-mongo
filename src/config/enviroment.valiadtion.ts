import Joi from 'joi';

export default Joi.object({
  DATABASE_AUTOLOAD: Joi.boolean().default(false),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_USER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().default(3600),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  NODE_ENV: Joi.string().valid('dev', 'production', 'test').default('dev'),
  PORT: Joi.number().default(8000),
});
