import RequestError from "./RequestError";

export default class AuthenticationError extends RequestError {

	constructor(status: number, body: any) {
		super(status, body);
	}
}
