
export default class RequestError extends Error {

	constructor(status: number, body: any) {
		super(`Request failed with status code ${status}. Body: ${JSON.stringify(body)}`);
	}
}
