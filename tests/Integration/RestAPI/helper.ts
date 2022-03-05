import { IOptions } from '../../../src';
import { parameters } from '../../../src/parameters';

export const RUN_INTEGRATION_TESTS = parameters.runIntegrationTests === 'true';

// api host
const host = parameters.apiUrl;
const version = 'v1';
const organizationUid = parameters.organizationUid;

export const opts: IOptions = {
	url: host,
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
		(opts.accountAuth as any)?.tokenId === '' ||
		(opts.accountAuth as any)?.token === ''
	) {
		console.warn('you must set auth details in order to run this test');
		skip();
	}
};

// TODO: Temporary solution until dynamic solution to get organization tag is developed
export const getOrganizationUid = () => {
	if (!organizationUid) {
		throw new Error('Required environment variable SOS_ORGANIZATION_UID is missing.');
	}

	return organizationUid;
};
