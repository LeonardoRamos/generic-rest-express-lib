import '@babel/polyfill';
import config from './config/config';
import app from './config/express';

Promise = require('bluebird'); 

global.__basedir = __dirname;

if (require.main === module) {
    app.listen(config.port, () => {
        console.info(`server started on port ${config.port} (${config.env})`);
    });
}

export default app;
