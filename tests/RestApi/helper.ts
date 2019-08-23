import IOptions from "../../src/RestApi/IOptions";
import RequestError from "../../src/RestApi/Error/RequestError";

export const nockOpts: IOptions = {
	url: 'http://docs.signageos.io',
	auth: {clientId: 'clientId', secret: 'secret'},
	version: 'v1',
};

export const errorResp: any = {"error": "some error"};
export const errorRespMessage: (status: number) => string = (status: number) => {
	return new RequestError(status, errorResp).message;
};
