import { parameters } from '../../../src/parameters';
import { IOptions } from '../../../src/apiTools';
import { ApiVersions } from '../../../src/RestApi/apiVersions';

export const RUN_INTEGRATION_TESTS = parameters.runIntegrationTests === 'true';

const apiUrl = parameters.apiUrl;
const version = ApiVersions.V1;
const organizationUid = parameters.organizationUid;

export const opts: IOptions = {
	url: apiUrl,
	version: version,
	organizationUid,
	organizationAuth: parameters.organizationAuth,
	accountAuth: parameters.accountAuth,
};

export const ALLOWED_TIMEOUT = 10000;

// In order to run these tests, fill in auth and RUN_INTEGRATION_TESTS environment variables
export const preRunCheck = (skip: () => never) => {
	if (
		!RUN_INTEGRATION_TESTS ||
		!(opts.accountAuth as any)?.tokenId ||
		!(opts.accountAuth as any)?.token
	) {
		console.warn('you must set auth details in order to run this test');
		skip();
	}
};
