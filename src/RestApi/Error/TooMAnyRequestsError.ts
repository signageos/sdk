import RequestError from './RequestError';

export default class TooMAnyRequestsError extends RequestError {
	constructor(status: number, body: any) {
		super(status, body);
		// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, TooMAnyRequestsError.prototype);
	}
}
