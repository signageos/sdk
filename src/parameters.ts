import { log } from './Console/log';

const path = require('path');
const packageConfig = require('../package.json');
const environment = process.env.NODE_ENV || 'dev';
const rootPath = path.normalize(path.join(__dirname, '..'));
const testsPath = rootPath + '/tests';
const distPath = rootPath + '/dist';

require('dotenv').config(); // try CWD path first
require('dotenv').config({ path: path.join(rootPath, '.env') }); // default looks to lib path

const requestMaxAttempts = process.env.SOS_REQUEST_MAX_ATTEMPTS ? parseInt(process.env.SOS_REQUEST_MAX_ATTEMPTS) : 3;
const configurableEnvVars = [
	'SOS_PROFILE',
	'SOS_API_IDENTIFICATION',
	'SOS_API_SECURITY_TOKEN',
	'SOS_AUTH_CLIENT_ID',
	'SOS_AUTH_SECRET',
	'SOS_ORGANIZATION_UID',
] as const;

for (const envVar of configurableEnvVars) {
	if (process.env[envVar]) {
		log('warning', `Environment variable ${envVar} found. Will override default values from ~/.sosrc`);
	}
}

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
	profile: process.env.SOS_PROFILE,
	apiUrl,
	requestMaxAttempts,
	organizationUid: process.env.SOS_ORGANIZATION_UID,
	forwardServerUrl: process.env.SOS_FORWARD_SERVER_URL,
	organizationAuth:
		process.env.SOS_AUTH_CLIENT_ID && process.env.SOS_AUTH_SECRET
			? {
					clientId: process.env.SOS_AUTH_CLIENT_ID,
					secret: process.env.SOS_AUTH_SECRET,
				}
			: undefined,
	accountAuth:
		process.env.SOS_API_IDENTIFICATION && process.env.SOS_API_SECURITY_TOKEN
			? {
					tokenId: process.env.SOS_API_IDENTIFICATION,
					token: process.env.SOS_API_SECURITY_TOKEN,
				}
			: undefined,
};
