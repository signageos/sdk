export default class RequestError extends Error {
	public readonly errorCode: number | undefined;
	public readonly errorName: string | undefined;

	constructor(status: number, body: any) {
		super(`Request failed with status code ${status}. Body: ${JSON.stringify(body)}`);
		// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, RequestError.prototype);
		if (typeof body === 'object') {
			this.errorCode = body.errorCode;
			this.errorName = body.errorName;
		}
	}
}
