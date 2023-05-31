const Sequelize = require('sequelize');
const BaseEntity = require('./base.entity');

class BaseApiEntity extends BaseEntity {
	constructor() {
		super();

		this.externalId = {
			type: Sequelize.STRING(32),
			allowNull: false,
			unique: true,
			field: 'external_id',
		};
		this.active = {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		};
		this.insertDate = {
			type: Sequelize.DATE,
			allowNull: false,
			field: 'creation_date',
		};
		this.updateDate = {
			type: Sequelize.DATE,
			allowNull: false,
			field: 'update_date',
		};
		this.deleteDate = {
			type: Sequelize.DATE,
			allowNull: true,
			field: 'delete_date',
		};
	}

  	toJSON() {
		let attributes = super.toJSON();

		Object.keys(attributes).forEach((key) => {
			if (key === 'id' || key.startsWith('id_')) {
				delete attributes[key];
			}
		});

		return attributes;
  	}
}

module.exports = BaseApiEntity;
