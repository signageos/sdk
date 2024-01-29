export default class ResponseBodyFormatError extends Error {
	constructor(body: any) {
		super(`Response body has invalid non-JSON format. Body: ${JSON.stringify(body)}`);
		// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, ResponseBodyFormatError.prototype);
	}
}
