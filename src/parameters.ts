import { log } from './Console/log';

const path = require('path');
const packageConfig = require('../package.json');
const environment = process.env.NODE_ENV || 'dev';
const rootPath = path.normalize(path.join(__dirname, '..'));
const testsPath = rootPath + '/tests';
const distPath = rootPath + '/dist';

// Allow consumers (e.g. the CLI) to opt out of all implicit configuration loading. When the SDK is
// used as a library, loading its own shipped .env and reading process.env can clobber configuration
// that the consumer resolves from other sources (e.g. ~/.sosrc). Set SOS_SKIP_DOTENV=1 before
// requiring the SDK to enable "explicit mode": no .env loading, no env-var reads, no warnings —
// all configuration must come via the SDK function `options` arguments.
const explicitMode = !!process.env.SOS_SKIP_DOTENV && process.env.SOS_SKIP_DOTENV !== '0' && process.env.SOS_SKIP_DOTENV !== 'false';

const staticPaths = {
	environment,
	version: packageConfig.version,
	configPath: __dirname,
	paths: {
		rootPath,
		testsPath,
		distPath,
	},
};

type Parameters = typeof staticPaths & {
	profile: string | undefined;
	apiUrl: string | undefined;
	requestMaxAttempts: number;
	organizationUid: string | undefined;
	appletUid: string | undefined;
	forwardServerUrl: string | undefined;
	organizationAuth: { clientId: string; secret: string } | undefined;
	accountAuth: { tokenId: string; token: string } | undefined;
};

function buildExplicitParameters(): Parameters {
	return {
		...staticPaths,
		profile: undefined,
		apiUrl: undefined,
		requestMaxAttempts: 3,
		organizationUid: undefined,
		appletUid: undefined,
		forwardServerUrl: undefined,
		organizationAuth: undefined,
		accountAuth: undefined,
	};
}

function buildImplicitParameters(): Parameters {
	require('dotenv').config(); // try CWD path first
	require('dotenv').config({ path: path.join(rootPath, '.env') }); // default looks to lib path

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

	return {
		...staticPaths,
		profile: process.env.SOS_PROFILE,
		apiUrl: process.env.SOS_API_URL,
		requestMaxAttempts: process.env.SOS_REQUEST_MAX_ATTEMPTS ? Number.parseInt(process.env.SOS_REQUEST_MAX_ATTEMPTS) : 3,
		organizationUid: process.env.SOS_ORGANIZATION_UID,
		appletUid: process.env.SOS_APPLET_UID,
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
}

export const parameters: Parameters = explicitMode ? buildExplicitParameters() : buildImplicitParameters();
