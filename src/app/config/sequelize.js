const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('./config');

if (config.database.dialect === 'postgres') {
    const pg = require('pg');
    pg.defaults.parseInt8 = true;
}

const db = {};

const sequelize = new Sequelize(
    config.database.db,
    config.database.user,
    config.database.password,
    {
        dialect: config.database.dialect,
        port: config.database.port,
        host: config.database.host,
    },
);

db.loadModels = (baseDir) => {
    let models = [];

    const modelsDir = path.normalize(path.join(baseDir, config.scanModelPath));

    fs.readdirSync(modelsDir, { withFileTypes: true })
        .filter(file => file.name.indexOf('.') !== 0 && file.name.indexOf('.map') === -1
            && file.name.indexOf('.js') !== -1 && file.isFile())
        .forEach((file) => {
            console.info(`Loading model file ${file}`);
            models.push(path.join(modelsDir, file.name));
        });

    return models;
};

db.syncModels = () => {
    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    
    sequelize.sync().then((result) => {
        console.info('Database synchronized');
    }).catch(err => {
        console.log(err);
    });
};

module.exports = _.extend(
    {
        sequelize,
        Sequelize,
    },
    db,
);
