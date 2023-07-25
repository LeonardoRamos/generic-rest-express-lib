const { Joi } = require('express-validation');
const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const ApiError = require('../../error/api.error');
const ApiRestController = require('./api.rest.controller');

module.exports = class BaseRestController extends ApiRestController {
    
    constructor(apiService) {
        super(apiService)

        this.apiService = apiService;

        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    async getById(req, res, next, id) {
        try {
            const entityFound = await this.apiService.findById(id);
            
            if (!entityFound) {
                const e = new ApiError(
                    'No entity found for id [' + id + ']', 
                    'ENTITY_NOT_FOUND_ERROR',
                    httpStatus.NOT_FOUND,
                    true
                );
                    
                return next(e);
            }
            
            req.entity = entityFound;
            
            return next();
    
        } catch (error) {
            return this.handleError(error, next);
        }
    }
    
    update(req, res, next) {
        const entity = { ...req.entity, ...req.body };
    
        return this.apiService.update(entity)
            .then(savedEntity => res.json(savedEntity))
            .catch(e => {
                return this.handleError(e, next);
            });
    }
    
    remove(req, res, next) {
        return this.apiService.delete(req.entity)
            .then(() => res.status(204))
            .catch(e => {
                return this.handleError(e, next);
            });
    }

    paramValidation() {
        return {
            ...super.paramValidation(), 
            ...{
                update: {
                    body: {},
                    params: Joi.object({
                        id: Joi.string().hex().required(),
                    })
                },
                remove: {
                    params: Joi.object({
                        id: Joi.string().hex().required(),
                    })
                }
            }
        };
    }

};
