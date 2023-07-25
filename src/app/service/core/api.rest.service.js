const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const queryBuilder = require('./query.builder');
const resultMapper = require('./mapper/result.mapper');

module.exports = class ApiRestService {

    constructor(model) {
        this.model = model;

        this.findAll = this.findAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async findAll(requestQuery) {
        let query = queryBuilder.buildQuery(this.model, requestQuery);
        let result = await this.model.findAndCountAll(query);

        return {
            records: resultMapper.mapResulRecords(result, requestQuery),
            metadata: resultMapper.mapResultMetadata(query, result, requestQuery),
        };
    }

    async update(entityModel) {
        entityModel.updateDate = Sequelize.NOW;
        return await entityModel.save();
    }

    async delete(entityModel) {
        return await entityModel.destroy();
    }
};
