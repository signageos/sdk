import * as dotenv from 'dotenv';
import * as path from 'path';
import * as should from 'should';

describe('.env file for production build', function () {
	it('should always contain exact values because this file is used in production build of @signageos/sdk library as default values', () => {
		const env: Record<string, string> = {};
		dotenv.config({
			path: path.join(__dirname, '..', '..', '.env.production'),
			processEnv: env,
		});

		const { SOS_API_URL, ...rest } = env;

		should(SOS_API_URL).equal('https://api.signageos.io');
		should(Object.values(rest).every((v) => v === undefined || v === '')).be.true();
	});
});
