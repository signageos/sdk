import IOptions, { IAuthOptions } from '../../../src/RestApi/IOptions';
import RequestError from '../../../src/RestApi/Error/RequestError';
import { ApiVersions } from '../../../src/RestApi/apiVersions';

export const nockOpts: IOptions & { auth: IAuthOptions } = {
	url: 'https://api.signageos.io',
	auth: { clientId: 'clientId', secret: 'secret' },
	version: ApiVersions.V1,
};

export const successRes: any = { message: 'OK' };
export const errorResp: any = { error: 'some error' };
export const errorRespMessage: (status: number) => string = (status: number) => {
	return new RequestError(status, errorResp).message;
};

export const nockAuthHeader = {
	reqheaders: {
		'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
	},
};
