import IOptions, { IAuthOptions } from "../../../src/RestApi/IOptions";
import RequestError from "../../../src/RestApi/Error/RequestError";

export const nockOpts: IOptions & { auth: IAuthOptions } = {
	url: 'http://docs.signageos.io',
	auth: { clientId: 'clientId', secret: 'secret' },
	version: 'v1',
};

export const successRes: any = { message: 'OK' };
export const errorResp: any = { error: 'some error' };
export const errorRespMessage: (status: number) => string = (status: number) => {
	return new RequestError(status, errorResp).message;
};
