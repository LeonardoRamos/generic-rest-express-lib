const Joi = require('@hapi/joi');
const dotenv = require('dotenv');

dotenv.config();

const environments = ['development', 'production', 'test', 'provision']
    .reduce((configEnvs, env, index, envs) => ({ ...configEnvs, ...{ [envs[index]]: env } }), {});

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.any()
        .valid(...Object.keys(environments))
        .default(environments.development),

    PORT: Joi.number().default(9503),

    JWT_EXPIRATION: Joi.number().default(86000),
    JWT_SECRET: Joi.string()
        .description('JWT Secret required to sign')
        .default('6cfaef779158723ca4998ec416d18eb8'),

    DB_DATABASE: Joi.string()
        .description('Database name')
        .default('TestNode'),

    DB_DIALECT: Joi.string()
        .description('Database dialect')
        .default('postgres'),

    DB_PORT: Joi.number().default(5432),
    DB_HOST: Joi.string().default('localhost'),
    DB_USER: Joi.string()
        .description('Database username')
        .default('postgres'),

    DB_PASSWORD: Joi.string()
        .allow('')
        .description('Database password')
        .default('postgres')
        .optional(),

    LOG_FILE: Joi.string()
        .description('Log file path')
        .default('../../../logs/nodeGenericApi.log'),

    SCAN_MODEL_PATH: Joi.string()
        .description('Base scan path for sequelie entities')
        .default('/domain')

})
    .unknown()
    .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    environments,
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwtSecret: envVars.JWT_SECRET,
    jwtExpiration: envVars.JWT_EXPIRATION,
    logFile: envVars.LOG_FILE,
    scanModelPath: envVars.SCAN_MODEL_PATH,
    database: {
        db: envVars.DB_DATABASE,
        dialect: envVars.DB_DIALECT,
        port: envVars.DB_PORT,
        host: envVars.DB_HOST,
        user: envVars.DB_USER,
        password: envVars.DB_PASSWORD,
    },
};

module.exports = config;
