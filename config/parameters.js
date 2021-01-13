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
	runIntegrationTests: process.env.RUN_INTEGRATION_TESTS,
	requestMaxAttempts: process.env.SOS_REQUEST_MAX_ATTEMPTS,
	organizationUid: process.env.SOS_ORGANIZATION_UID,
	organizationAuth: {
		clientId: process.env.SOS_AUTH_CLIENT_ID,
		secret: process.env.SOS_AUTH_SECRET,
	},
	accountAuth: {
		tokenId: process.env.SOS_API_IDENTIFICATION,
		token: process.env.SOS_API_SECURITY_TOKEN,
	},
};
