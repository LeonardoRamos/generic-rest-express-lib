const express = require('express');
const dbHealth = require('../../config/health/db.health');

function setupManageRoutes(appPackage) {
	const router = express.Router();

	router.get('/health', async (req, res) => {
		let status = 'UP';

		let db = await dbHealth.doHealthCheck();
		status = db.status === 'UP' ? status : 'DOWN';

		res.send({
			status,
			components: { db },
		});
	});

	if (appPackage) {
		router.get('/info', (req, res) => {
			res.send({
				name: appPackage.name,
				description: appPackage.description,
				version: appPackage.version,
			});
		});
	}

	return router;
}

module.exports = { setupManageRoutes };
