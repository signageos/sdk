import * as nock from 'nock';

import IOptions, { IAuthOptions } from '../../../src/RestApi/IOptions';
import RequestError from '../../../src/RestApi/Error/RequestError';
import { ApiVersions } from '../../../src/RestApi/apiVersions';

interface INockOptsParams {
	version?: ApiVersions;
}

type TNockOpts = ({ version }: INockOptsParams) => IOptions & { auth: IAuthOptions };

export const getNockOpts: TNockOpts = ({ version }: INockOptsParams) => ({
	url: 'https://api.signageos.io',
	auth: { clientId: 'clientId', secret: 'secret' },
	version: version ?? ApiVersions.V1,
	clientVersions: {},
});

export const successRes: any = { message: 'OK' };
export const errorResp: any = { error: 'some error' };
export const errorRespMessage: (status: number) => string = (status: number) => {
	return new RequestError(status, errorResp).message;
};

export const nockOpts1 = getNockOpts({});

export const nockAuthHeader1 = {
	reqheaders: {
		'x-auth': `${nockOpts1.auth.clientId}:${nockOpts1.auth.secret}`, // checks the x-auth header presence
	},
};

export const createNock = () => nock(nockOpts1.url, nockAuthHeader1);
