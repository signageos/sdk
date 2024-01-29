export default class UnsupportedError extends Error {
	constructor(message?: string) {
		super(message);
		// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, UnsupportedError.prototype);
	}
}
