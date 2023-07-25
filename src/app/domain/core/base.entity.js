const Sequelize = require('sequelize');

class BaseEntity {
	
	constructor() {
		this.id = {
	  		type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		};
	}

  	toJSON() {
		let attributes = { ...{}, ...this.get() };

		Object.keys(attributes).forEach((key) => {
			if (attributes[key] === null) {
				delete attributes[key];
			}
		});

		return attributes;
  	}
}

module.exports = BaseEntity;
