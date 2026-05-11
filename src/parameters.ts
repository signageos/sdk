import { log } from './Console/log';

const path = require('path');
const packageConfig = require('../package.json');
const environment = process.env.NODE_ENV || 'dev';
const rootPath = path.normalize(path.join(__dirname, '..'));
const testsPath = rootPath + '/tests';
const distPath = rootPath + '/dist';

// Allow consumers (e.g. the CLI) to opt out of dotenv loading. When the SDK is used as a library,
// loading its own shipped .env into process.env can clobber configuration that the consumer
// resolves from other sources (e.g. ~/.sosrc). Set SOS_SKIP_DOTENV=1 before requiring the SDK
// to disable both the CWD and SDK-package .env loading.
const skipDotenv = !!process.env.SOS_SKIP_DOTENV && process.env.SOS_SKIP_DOTENV !== '0' && process.env.SOS_SKIP_DOTENV !== 'false';
if (!skipDotenv) {
	require('dotenv').config(); // try CWD path first
	require('dotenv').config({ path: path.join(rootPath, '.env') }); // default looks to lib path
}

const requestMaxAttempts = process.env.SOS_REQUEST_MAX_ATTEMPTS ? Number.parseInt(process.env.SOS_REQUEST_MAX_ATTEMPTS) : 3;
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

// SOS_API_URL is no longer required at module load. Consumers that don't rely on the SDK's
// shipped .env (e.g. the CLI, which resolves the URL from ~/.sosrc) can opt out via
// SOS_SKIP_DOTENV and pass `options.url` to the relevant SDK functions instead.
const apiUrl = process.env.SOS_API_URL;

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
