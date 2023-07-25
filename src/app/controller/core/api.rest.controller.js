const { Joi } = require('express-validation');
const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const ApiError = require('../../error/api.error');

module.exports = class ApiRestController {
    
    constructor(apiService) {
        this.apiService = apiService;

        this.get = this.get.bind(this);
        this.list = this.list.bind(this);
        this.insert = this.insert.bind(this);
    }

    get(req, res) {
        return res.json(req.entity);
    }

    list(req, res, next) {
        return this.apiService.findAll(req.query)
            .then(entities => res.json(entities))
            .catch(e => {
                return this.handleError(e, next);
            });
    }

    insert(req, res, next) {
        return this.apiService.save(req.body)
            .then(savedEntity => res.json(savedEntity))
            .catch(e => {
                return this.handleError(e, next);
            });
    }

    paramValidation() {
        return {
            insert: {
                body: {}
            }
        };
    }

};
