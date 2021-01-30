import { IOptions } from "../../../src/index";

const parameters = require('../../../config/parameters');

export const RUN_INTEGRATION_TESTS = parameters.runIntegrationTests === 'true';

// api host
const host = parameters.apiUrl;
const version = 'v1';
const organizationUid = parameters.organizationUid;
// client credentials
const clientId = parameters.organizationAuth.clientId;
const secret = parameters.organizationAuth.secret;
// account credentials
const tokenId = parameters.accountAuth.tokenId;
const token = parameters.accountAuth.token;

export const opts: IOptions = {
	url: host,
	version: version,
	organizationUid,
	organizationAuth: {
		clientId,
		secret,
	},
	accountAuth: {
		tokenId,
		token,
	},
};
