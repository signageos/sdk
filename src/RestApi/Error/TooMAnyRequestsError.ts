import RequestError from "./RequestError";

export default class TooMAnyRequestsError extends RequestError {

	constructor(status: number, body: any) {
		super(status, body);
	}
}
