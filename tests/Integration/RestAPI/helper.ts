import IOptions from "../../../src/RestApi/IOptions";

const parameters = require('../../../config/parameters');

// api host
const host = parameters.apiUrl;
const version = 'v1';
// client credentials
const clientId = parameters.auth.clientId;
const secret = parameters.auth.secret;
// account credentials
const accountId = parameters.accountAuth.clientId;
const accountSecret = parameters.accountAuth.secret;

export const opts: IOptions = {
	url: host,
	version: version,
	auth: {
		clientId,
		secret
	},
};

export const accountOpts: IOptions = {
	url: host,
	version: version,
	auth: {
		clientId: accountId,
		secret: accountSecret
	}
};
