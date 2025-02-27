import NotFoundError from '../RestApi/Error/NotFoundError';

/**
 * Wraps a request promise and returns null if the request fails with a 404 status code.
 *
 * Useful for "GET one" requests where the resource might not exist.
 */
export async function returnNullOn404<T>(promise: Promise<T>): Promise<T | null> {
	try {
		return await promise;
	} catch (error) {
		if (error instanceof NotFoundError) {
			return null;
		}

		throw error;
	}
}
