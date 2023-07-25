const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const queryBuilder = require('./query.builder');
const resultMapper = require('./mapper/result.mapper');
const ApiRestService = require('./api.rest.service');

module.exports = class BaseApiRestService extends ApiRestService {

    constructor(model) {
        super(model);

        this.model = model;

        this.findByExternalId = this.findByExternalId.bind(this);
        this.save = this.save.bind(this);
    }

    async findByExternalId(externalId) {
        return await this.model.findOne({
            where: { externalId },
        });
    }

    async save(entity) {
        const entityModel = this.model.build(entity);

        entityModel.externalId = uuidv4().split('-').join('');
        entityModel.insertDate = Sequelize.NOW;
        entityModel.updateDate = entityModel.insertDate;

        return await entityModel.save();
    }

};
