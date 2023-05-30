const config = require('./config/config');
const app = require('./config/express');
const db = require('./config/sequelize');
const logger = require('./config/winston');
const ApiError = require('./error/api.error');
const BaseEntity = require('./domain/core/base.entity');
const ApiRestService = require('./service/core/api.rest.service');
const ApiRestController = require('./controller/core/api.rest.controller');
Promise = require('bluebird'); 

module.exports = {
    config,
    app,
    db,
    logger,
    ApiError,
    BaseEntity,
    ApiRestService,
    ApiRestController
};