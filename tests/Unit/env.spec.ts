import * as should from 'should';
import * as path from 'path';
import * as fs from 'fs';

describe('.env file for production build', function () {

	it('should always contain exact values because this file is used in production build of @signageos/sdk library as default values', () => {
		const expectedContents = `SOS_API_URL=https://api.signageos.io\n`;
		const envFile = path.join(__dirname, '..', '..', '.env.production');
		const contents = fs.readFileSync(envFile, 'utf8');
		should(contents).be.equal(expectedContents);
	});
});
