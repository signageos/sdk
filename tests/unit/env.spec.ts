import * as dotenv from 'dotenv';
import * as path from 'path';
import should from 'should';

describe('.env file for production build', function () {
	it('should always contain exact values because this file is used in production build of @signageos/sdk library as default values', () => {
		const env: Record<string, string> = {};
		dotenv.config({
			path: path.join(__dirname, '..', '..', '.env.production'),
			processEnv: env,
		});

		const { SOS_API_URL, SOS_FORWARD_SERVER_URL, ...rest } = env;

		should(SOS_API_URL).equal('https://api.signageos.io');
		should(SOS_FORWARD_SERVER_URL).equal('https://forward.signageos.io');
		should(Object.values(rest).every((v) => v === undefined || v === '')).be.true();
	});
});
