import RequestError from "./RequestError";

export default class NotFoundError extends RequestError {

	constructor(status: number, body: any) {
		super(status, body);
	}
}
