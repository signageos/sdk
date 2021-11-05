import { IOptions } from "../../../src/index";
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
