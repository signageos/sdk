const path = require('path');
const packageConfig = require('../package.json');
const environment = process.env.NODE_ENV || 'dev';
const rootPath = path.normalize(path.join(__dirname, '..'));
const testsPath = rootPath + '/tests';
const distPath = rootPath + '/dist';

require('dotenv').config(); // try CWD path first
require('dotenv').config({ path: path.join(rootPath, '.env') }); // default looks to lib path

const requestMaxAttempts = process.env.SOS_REQUEST_MAX_ATTEMPTS ? parseInt(process.env.SOS_REQUEST_MAX_ATTEMPTS) : 3;
const apiUrl = process.env.SOS_API_URL;

if (!apiUrl) {
	throw new Error(`Environment variable SOS_API_URL is required`);
}

export const parameters = {
	environment,
	version: packageConfig.version,
	configPath: __dirname,
	paths: {
		rootPath,
		testsPath,
		distPath,
	},
	apiUrl,
	runIntegrationTests: process.env.RUN_INTEGRATION_TESTS,
	requestMaxAttempts,
	organizationUid: process.env.SOS_ORGANIZATION_UID,
	organizationAuth: process.env.SOS_AUTH_CLIENT_ID && process.env.SOS_AUTH_SECRET ? {
		clientId: process.env.SOS_AUTH_CLIENT_ID,
		secret: process.env.SOS_AUTH_SECRET,
	} : undefined,
	accountAuth: process.env.SOS_API_IDENTIFICATION && process.env.SOS_API_SECURITY_TOKEN ? {
		tokenId: process.env.SOS_API_IDENTIFICATION,
		token: process.env.SOS_API_SECURITY_TOKEN,
	} : undefined,
};
