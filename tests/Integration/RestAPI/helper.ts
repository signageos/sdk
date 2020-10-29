import { IOptions } from "../../../src/index";

const parameters = require('../../../config/parameters');

export const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === 'true';

// api host
const host = parameters.apiUrl;
const version = 'v1';
// client credentials
const clientId = parameters.organizationAuth.clientId;
const secret = parameters.organizationAuth.secret;
// account credentials
const tokenId = parameters.accountAuth.tokenId;
const token = parameters.accountAuth.token;

export const opts: IOptions = {
	url: host,
	version: version,
	organizationAuth: {
		clientId,
		secret,
	},
	accountAuth: {
		tokenId,
		token,
	},
};
