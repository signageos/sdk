import RequestError from "./RequestError";

export default class InternalApiError extends RequestError {

	constructor(status: number, body: any) {
		super(status, body);
	}
}
