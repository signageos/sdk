import * as path from 'path';
import { createRequire } from 'module';
import should from 'should';

// Mocha loads spec files via ESM under ts-node, so the CJS `require` global is unavailable.
// Use createRequire seeded with an absolute path inside the repo to get a CJS-style require we
// can use for cache busting and re-requiring the SDK source modules.
const cjsRequire = createRequire(path.join(process.cwd(), 'tests', 'unit', 'parameters.spec.ts'));
const repoRoot = process.cwd();
const parametersPath = path.join(repoRoot, 'src', 'parameters.ts');
const indexPath = path.join(repoRoot, 'src', 'index.ts');

const SOS_ENV_VARS = [
	'SOS_SKIP_DOTENV',
	'SOS_API_URL',
	'SOS_PROFILE',
	'SOS_ORGANIZATION_UID',
	'SOS_FORWARD_SERVER_URL',
	'SOS_AUTH_CLIENT_ID',
	'SOS_AUTH_SECRET',
	'SOS_API_IDENTIFICATION',
	'SOS_API_SECURITY_TOKEN',
	'SOS_REQUEST_MAX_ATTEMPTS',
] as const;

function clearSosEnv() {
	for (const key of SOS_ENV_VARS) {
		delete process.env[key];
	}
}

function setEnv(values: Partial<Record<(typeof SOS_ENV_VARS)[number], string>>) {
	for (const [key, value] of Object.entries(values)) {
		process.env[key] = value;
	}
}

// Clear the require cache for every src/ module so a re-require rebuilds the parameters object
// from the current process.env. parameters.ts captures env at module load time.
function freshRequire<T = unknown>(modulePath: string): T {
	const srcPrefix = `${repoRoot}${path.sep}src${path.sep}`;
	for (const cacheKey of Object.keys(cjsRequire.cache)) {
		if (cacheKey.startsWith(srcPrefix)) {
			delete cjsRequire.cache[cacheKey];
		}
	}
	return cjsRequire(modulePath) as T;
}

describe('parameters.ts — explicit mode (SOS_SKIP_DOTENV)', function () {
	const originalEnv: Record<string, string | undefined> = {};

	before(() => {
		for (const key of SOS_ENV_VARS) {
			originalEnv[key] = process.env[key];
		}
	});

	beforeEach(() => {
		clearSosEnv();
	});

	after(() => {
		clearSosEnv();
		for (const [key, value] of Object.entries(originalEnv)) {
			if (value !== undefined) {
				process.env[key] = value;
			}
		}
	});

	it('exposes only static paths/version and undefined config when SOS_SKIP_DOTENV=1', () => {
		// Deliberately set every env var the SDK would normally read — explicit mode must ignore them.
		setEnv({
			SOS_SKIP_DOTENV: '1',
			SOS_API_URL: 'https://leaked.example.com',
			SOS_PROFILE: 'leaked-profile',
			SOS_ORGANIZATION_UID: 'leaked-org',
			SOS_FORWARD_SERVER_URL: 'https://leaked-forward.example.com',
			SOS_AUTH_CLIENT_ID: 'leaked-client',
			SOS_AUTH_SECRET: 'leaked-secret',
			SOS_API_IDENTIFICATION: 'leaked-id',
			SOS_API_SECURITY_TOKEN: 'leaked-token',
			SOS_REQUEST_MAX_ATTEMPTS: '99',
		});

		const { parameters } = freshRequire<typeof import('../../src/parameters')>(parametersPath);

		should(parameters.apiUrl).be.undefined();
		should(parameters.profile).be.undefined();
		should(parameters.organizationUid).be.undefined();
		should(parameters.forwardServerUrl).be.undefined();
		should(parameters.organizationAuth).be.undefined();
		should(parameters.accountAuth).be.undefined();
		should(parameters.requestMaxAttempts).equal(3);
		should(parameters.version).be.a.String();
	});

	it('importing the barrel does not throw when SOS_SKIP_DOTENV=1 and no SOS_API_URL is set', () => {
		setEnv({ SOS_SKIP_DOTENV: '1' });
		should(() => freshRequire(indexPath)).not.throw();
	});

	it('lazy `api` proxy throws a clear error in explicit mode when accessed without config', () => {
		setEnv({ SOS_SKIP_DOTENV: '1' });
		const sdk = freshRequire<typeof import('../../src')>(indexPath);
		should(() => sdk.api.applet).throw(/API URL is not configured/);
	});

	it('createApiV1 with explicit options works in explicit mode (no implicit fallbacks needed)', () => {
		setEnv({ SOS_SKIP_DOTENV: '1' });
		const sdk = freshRequire<typeof import('../../src')>(indexPath);
		const api = sdk.createApiV1({ url: 'https://test.example.com' });
		should(api.accountOptions.url).equal('https://test.example.com');
		should(api.organizationOptions.url).equal('https://test.example.com');
	});

	it('treats SOS_SKIP_DOTENV=0 as disabled (implicit mode)', () => {
		setEnv({ SOS_SKIP_DOTENV: '0', SOS_API_URL: 'https://from-env.example.com' });
		const { parameters } = freshRequire<typeof import('../../src/parameters')>(parametersPath);
		should(parameters.apiUrl).equal('https://from-env.example.com');
	});

	it('treats SOS_SKIP_DOTENV=false as disabled (implicit mode)', () => {
		setEnv({ SOS_SKIP_DOTENV: 'false', SOS_API_URL: 'https://from-env.example.com' });
		const { parameters } = freshRequire<typeof import('../../src/parameters')>(parametersPath);
		should(parameters.apiUrl).equal('https://from-env.example.com');
	});
});

describe('parameters.ts — implicit mode (backward compat)', function () {
	const originalEnv: Record<string, string | undefined> = {};

	before(() => {
		for (const key of SOS_ENV_VARS) {
			originalEnv[key] = process.env[key];
		}
	});

	beforeEach(() => {
		clearSosEnv();
	});

	after(() => {
		clearSosEnv();
		for (const [key, value] of Object.entries(originalEnv)) {
			if (value !== undefined) {
				process.env[key] = value;
			}
		}
	});

	it('reads SOS_API_URL from process.env when SOS_SKIP_DOTENV is unset', () => {
		setEnv({ SOS_API_URL: 'https://from-env.example.com' });

		const { parameters } = freshRequire<typeof import('../../src/parameters')>(parametersPath);
		should(parameters.apiUrl).equal('https://from-env.example.com');
	});

	it('reads SOS_ORGANIZATION_UID and auth pairs from process.env when SOS_SKIP_DOTENV is unset', () => {
		setEnv({
			SOS_API_URL: 'https://x.example.com',
			SOS_ORGANIZATION_UID: 'org-123',
			SOS_API_IDENTIFICATION: 'id-1',
			SOS_API_SECURITY_TOKEN: 'tok-1',
			SOS_AUTH_CLIENT_ID: 'client-1',
			SOS_AUTH_SECRET: 'secret-1',
		});

		const { parameters } = freshRequire<typeof import('../../src/parameters')>(parametersPath);
		should(parameters.organizationUid).equal('org-123');
		should(parameters.accountAuth).deepEqual({ tokenId: 'id-1', token: 'tok-1' });
		should(parameters.organizationAuth).deepEqual({ clientId: 'client-1', secret: 'secret-1' });
	});
});
