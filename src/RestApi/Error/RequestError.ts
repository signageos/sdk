
export default class RequestError extends Error {

	constructor(status: number, body: any) {
		super(`Request failed with status code ${status}. Body: ${JSON.stringify(body)}`);
		// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, RequestError.prototype);
	}
}
