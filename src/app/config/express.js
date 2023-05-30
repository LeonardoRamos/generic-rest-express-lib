const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const winstonInstance = require('./winston');
const manageRoutes = require('../route/base/manage.route');
const config = require('./config');
const ApiError = require('../error/api.error');

const app = express();

if (config.env === config.environments.development) {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

if (config.env === config.environments.development) {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(expressWinston.logger({
        winstonInstance,
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorize: true
    }));
}

app.setupApp = (appPackage) => {

    app.use('/manage', manageRoutes.setupManageRoutes(appPackage));

    app.use((err, req, res, next) => {
        if (!(err instanceof ApiError)) {
            winstonInstance.error(err);
    
            let code = 'ERROR_CODE';
    
            if (err.name === 'UnauthorizedError') {
                code = 'AUTH_ERROR_' + err.code.toUpperCase().split(' ').join('_');
    
            } else if (err.code) {
                code = err.code.toUpperCase().split(' ').join('_');
            }
    
            const apiError = new ApiError(err.message, code, err.status, err.isPublic);
            return next(apiError);
        }
    
        return next(err);
    });
    
    app.use((req, res, next) => {
        const err = new ApiError('API not found', 'API_NOT_FOUND', httpStatus.NOT_FOUND);
        return next(err);
    });
    
    if (config.env !== config.environments.test) {
        app.use(expressWinston.errorLogger({
            winstonInstance,
        }));
    }
    
    app.use((err, req, res, next) => {
        if (err instanceof expressValidation.ValidationError) {
            const errors = err.details.body
                .map(error => {
                    return {
                        code: 'VALIDATION_ERROR_' + error.context.key.toUpperCase(),
                        message: error.message,
                        stack: config.env === config.environments.development ? error.type : {}
                    }
                });
    
            res.status(err.status).json({ errors });
    
        } else {
            res.status(err.status).json({
                errors: [{
                    code: err.code,
                    message: err.isPublic ? err.message : httpStatus[err.status],
                    stack: config.env === config.environments.development ? err.stack : {}
                }]
            });
        }
    });
};

module.exports = app;
