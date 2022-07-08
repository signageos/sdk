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
});

export const successRes: any = { message: 'OK' };
export const errorResp: any = { error: 'some error' };
export const errorRespMessage: (status: number) => string = (status: number) => {
	return new RequestError(status, errorResp).message;
};

const nockOptsV1 = getNockOpts({});
export const nockAuthHeader1 = {
	reqheaders: {
		'x-auth': `${nockOptsV1.auth.clientId}:${nockOptsV1.auth.secret}`, // checks the x-auth header presence
	},
};
