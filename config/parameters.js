
const path = require('path');
const { assign } = require('lodash');
const packageConfig = require('../package.json');
const environment = process.env.NODE_ENV || 'dev';
const rootPath = __dirname + path.normalize('/..');
const testsPath = rootPath + '/tests';
const distPath = rootPath + '/dist';

try {
	const localEnv = require('./env.' + environment + '.json');
	process.env = assign(process.env, localEnv);
} catch (e) {}

module.exports = {
	environment,
	version: packageConfig.version,
	configPath: __dirname,
	paths: {
		rootPath,
		testsPath,
		distPath,
	},
	apiUrl: process.env.api_url,
	auth: {
		clientId: process.env.auth_client_id,
		secret: process.env.auth_secret,
	},
};
