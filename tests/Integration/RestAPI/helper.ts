import IOptions from "../../../src/RestApi/IOptions";

// client credentials
const clientId = process.env.CLIENT_ID || '';
const secret = process.env.CLIENT_SECRET || '';
// account credentials
const accountId = process.env.ACCOUNT_ID || '';
const accountSecret = process.env.ACCOUNT_SECRET || '';

export const opts: IOptions = {
	url: 'https://api.signageos.io',
	version: 'v1',
	auth: {
		clientId,
		secret
	},
};

export const accountOpts: IOptions = {
	url: 'https://api.signageos.io',
	version: 'v1',
	auth: {
		clientId: accountId,
		secret: accountSecret
	}
};
