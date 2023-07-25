const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const queryBuilder = require('./query.builder');
const resultMapper = require('./mapper/result.mapper');
const ApiRestService = require('./api.rest.service');

module.exports = class BaseRestService extends ApiRestService {

    constructor(model) {
        super(model);

        this.model = model;

        this.findById = this.findById.bind(this);
        this.save = this.save.bind(this);
    }

    async findById(id) {
        return await this.model.findOne({
            where: { id },
        });
    }

    async save(entity) {
        const entityModel = this.model.build(entity);

        entityModel.insertDate = Sequelize.NOW;
        entityModel.updateDate = entityModel.insertDate;

        return await entityModel.save();
    }

};
