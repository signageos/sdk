/**
 * This is a special type of array that represents a paginated list of items.
 * REST API supports pagination using a `link` header in the response.
 * On top of standard Array methods, this class provides a method to get the next page of items `getNextPage`.
 */
export interface IPaginatedList<T> extends Array<T> {
	/**
	 * Get the next page of items.
	 * If there is no next page, it returns `null`.
	 * It can be recursively called to get all pages of items until there is no next page (`null`).
	 * @returns A promise that resolves to the next page of items or `null`.
	 *
	 * It does the request to the REST API to get the next page under the hood.
	 */
	getNextPage(): Promise<IPaginatedList<T> | null>;
}

export class PaginatedList<T> extends Array<T> implements IPaginatedList<T> {
	constructor(
		currentPageItems: T[],
		public readonly getNextPage: () => Promise<PaginatedList<T> | null>,
	) {
		super(...currentPageItems);
	}
}
