import * as dotenv from 'dotenv';
import * as path from 'path';
import should from 'should';

// Load from repository root instead of tests directory
const envPath = path.resolve(process.cwd(), '.env.production');

describe('.env file for production build', function () {
	it('should always contain exact values because this file is used in production build of @signageos/sdk library as default values', () => {
		const env: Record<string, string> = {};
		dotenv.config({
			path: envPath,
			processEnv: env,
		});

		const { SOS_API_URL, SOS_FORWARD_SERVER_URL, ...rest } = env;

		should(SOS_API_URL).equal('https://api.signageos.io');
		should(SOS_FORWARD_SERVER_URL).equal('https://forward.signageos.io');
		should(Object.values(rest).every((v) => v === undefined || v === '')).be.true();
	});
});
