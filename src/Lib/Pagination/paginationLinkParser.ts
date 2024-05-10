import { Response } from 'node-fetch';

/**
 * Get the next page link from the response headers.
 * This is a standard way how REST APIs provide pagination.
 * The function overlooks the host and port of the URL. It uses only the pathname and query parameters.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link
 * @see https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
 */
export function getNextPageLink(resp: Pick<Response, 'headers'>) {
	const linkHeader = resp.headers.get('link');
	if (!linkHeader) {
		return null;
	}

	const links = linkHeader.split(',');
	const nextLink = links.find((link) => link.includes('rel="next"'));
	if (!nextLink) {
		return null;
	}

	const urlEncoded = nextLink.split(';')[0].trim();
	const url = urlEncoded.slice(1, -1);

	return {
		url,
	};
}
