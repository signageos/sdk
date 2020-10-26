const path = require('path');
const packageConfig = require('../package.json');
const environment = process.env.NODE_ENV || 'dev';
const rootPath = path.normalize(path.join(__dirname, '..'));
const testsPath = rootPath + '/tests';
const distPath = rootPath + '/dist';

require('dotenv').config(); // try CWD path first
require('dotenv').config({ path: path.join(rootPath, '.env') }); // default looks to lib path

module.exports = {
	environment,
	version: packageConfig.version,
	configPath: __dirname,
	paths: {
		rootPath,
		testsPath,
		distPath,
	},
	apiUrl: process.env.SOS_API_URL,
	requestMaxAttempts: process.env.SOS_REQUEST_MAX_ATTEMPTS,
	organizationAuth: {
		clientId: process.env.SOS_AUTH_CLIENT_ID,
		secret: process.env.SOS_AUTH_SECRET,
	},
	accountAuth: {
		clientId: process.env.SOS_API_IDENTIFICATION,
		secret: process.env.SOS_API_SECURITY_TOKEN,
	},
};
