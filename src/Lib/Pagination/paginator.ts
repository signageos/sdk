import { Response } from 'node-fetch';
import { getUrl, parseJSONResponse } from '../../RestApi/requester';
import { PaginatedList } from './PaginatedList';
import IOptions from '../../RestApi/IOptions';
import { getNextPageLink } from './paginationLinkParser';

export class Paginator {
	constructor(private options: IOptions) {}

	/**
	 * Get a paginated list of items from the response.
	 * It creates the special paginated list array instance including the method to get the next page.
	 * The next page is fetched lazily when the method `getNextPage` is called.
	 * It returns a `null` value if there is no next page.
	 */
	async getPaginatedListFromResponse<TRaw, TItem = TRaw>(
		resp: Response,
		createEntity: (data: TRaw) => TItem,
	): Promise<PaginatedList<TItem>> {
		const rawItems: TRaw[] = await parseJSONResponse(resp);

		const items = rawItems.map((rawItem) => createEntity(rawItem));
		const getNextPage = async () => {
			const nextPageLink = getNextPageLink(resp);
			if (!nextPageLink) {
				return null;
			}
			const nextPageResp = await getUrl(this.options, nextPageLink.url);
			return this.getPaginatedListFromResponse(nextPageResp, createEntity);
		};
		return new PaginatedList<TItem>(items, getNextPage);
	}
}
