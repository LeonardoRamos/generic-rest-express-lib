import '@babel/polyfill';

import config from './config/config';
import app from './config/express';
import db from './config/sequelize';
import logger from './config/winston';
import ApiError from './error/api.error';
import BaseEntity from './domain/core/base.entity';
import ApiRestController from './controller/core/ApiRestController';
import ApiService from './service/core/api.rest.service';

Promise = require('bluebird'); 

global.__basedir = __dirname;

export default {
    config,
    app,
    db,
    logger,
    ApiError,
    BaseEntity,
    ApiService, 
    ApiRestController 
};
