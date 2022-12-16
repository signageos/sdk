import * as should from 'should';
import * as path from 'path';
import * as fs from 'fs';

describe('.env file for production build', function () {

	it('should always contain exact values because this file is used in production build of @signageos/sdk library as default values', () => {
		const expectedContents = `# NOTE: !!! Never update this file with testing values. This file is used in production for default values.

# Organization API SECURITY TOKENS
SOS_AUTH_CLIENT_ID=
SOS_AUTH_SECRET=

# Account API SECURITY TOKENS
SOS_API_IDENTIFICATION=
SOS_API_SECURITY_TOKEN=

SOS_API_URL=https://api.signageos.io

SOS_REQUEST_MAX_ATTEMPTS=3

RUN_INTEGRATION_TESTS=false
`;

		const envFile = path.join(__dirname, '..', '..', '.env');
		const contents = fs.readFileSync(envFile, 'utf8');
		should(contents).be.equal(expectedContents);
	});
});
