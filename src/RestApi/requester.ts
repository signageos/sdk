import Debug from 'debug';
import fetch, { BodyInit, Request, RequestInit, Response } from 'node-fetch';
import { stringify } from 'querystring';
import { deserializeJSON } from '../Utils/json';
import { parameters } from '../parameters';
import AuthenticationError from './Error/AuthenticationError';
import GatewayError from './Error/GatewayError';
import InternalApiError from './Error/InternalApiError';
import NotFoundError from './Error/NotFoundError';
import RequestError from './Error/RequestError';
import ResponseBodyFormatError from './Error/ResponseBodyFormatError';
import TooMAnyRequestsError from './Error/TooMAnyRequestsError';
import IOptions from './IOptions';
const debug = Debug('@signageos/sdk:RestApi:requester');

async function createOptions(method: 'POST' | 'GET' | 'PUT' | 'DELETE', options: IOptions, data?: BodyInit | Buffer): Promise<RequestInit> {
	const authOptions = typeof options.auth === 'function' ? await options.auth() : options.auth;

	const userAgent = createUserAgent(options);

	return {
		headers: {
			'Content-Type': options.contentType ?? 'application/json',
			'X-Auth': authOptions.clientId + ':' + authOptions.secret,
			'User-Agent': userAgent,
		},
		method,
		body: data,
	};
}

function createUri(options: IOptions, resource: string, queryParams?: any) {
	return [options.url, options.version, resource].join('/') + prepareQueryParams(queryParams);
}

export async function getResource(options: IOptions, path: string, query?: any) {
	return await doRequest({
		url: createUri(options, path, query),
		init: await createOptions('GET', options),
		followRedirects: options.followRedirects,
	});
}

export async function postResource(options: IOptions, path: string, data: any, query?: any) {
	return await doRequest({
		url: createUri(options, path, query),
		init: await createOptions('POST', options, data),
		followRedirects: options.followRedirects,
	});
}

export async function putResource(options: IOptions, path: string, data: any, query?: any) {
	return await doRequest({
		url: createUri(options, path, query),
		init: await createOptions('PUT', options, data),
		followRedirects: options.followRedirects,
	});
}

export async function deleteResource(options: IOptions, path: string, query?: any) {
	return await doRequest({
		url: createUri(options, path, query),
		init: await createOptions('DELETE', options),
		followRedirects: options.followRedirects,
	});
}

export async function getUrl(options: IOptions, url: string) {
	return await doRequest({
		url,
		init: await createOptions('GET', options),
		followRedirects: options.followRedirects,
	});
}

export async function parseJSONResponse(resp: Response): Promise<any> {
	const responseText = await resp.text();
	return parseJSON(responseText);
}

async function parseJSON(text: string): Promise<any> {
	try {
		return JSON.parse(text, deserializeJSON);
	} catch (error) {
		throw new ResponseBodyFormatError(text);
	}
}

function prepareQueryParams(qp: any): string {
	// ignore empty objects
	if (typeof qp === 'undefined' || Object.getOwnPropertyNames(qp).length === 0) {
		return '';
	}

	Object.getOwnPropertyNames(qp).forEach((prop: string) => {
		if (qp[prop] instanceof Date) {
			qp[prop] = qp[prop].toISOString();
		}
	});

	return '?' + stringify(qp);
}

async function doFetch(url: string | Request, init?: RequestInit): Promise<Response> {
	const resp = await fetch(url, init);

	if (resp.ok) {
		return resp;
	}

	let body = await resp.text();

	if (body) {
		body = await parseJSON(body);
	}

	switch (resp.status) {
		case 403:
			throw new AuthenticationError(resp.status, body);
		case 404:
			throw new NotFoundError(resp.status, body);
		case 429:
			throw new TooMAnyRequestsError(resp.status, body);
		case 500:
			throw new InternalApiError(resp.status, body);
		case 502:
		case 504:
			throw new GatewayError(resp.status, body);
		default:
			throw new RequestError(resp.status, body);
	}
}

// TODO: Copied from @signageos/lib, we can add this lib to dependencies ?
function wait(timeout: number) {
	return new Promise<void>((resolve: () => void) => setTimeout(() => resolve(), timeout));
}

export async function doRequest({
	url,
	init,
	fetchFn = doFetch,
	waitFn = wait,
	followRedirects = false,
	redirectCount = 0,
}: {
	url: string | Request;
	init?: RequestInit;
	fetchFn?: (url: string | Request, init?: RequestInit) => Promise<Response>;
	waitFn?: (timeout: number) => Promise<void>;
	followRedirects?: boolean;
	redirectCount?: number;
}): Promise<Response> {
	let tries = parameters.requestMaxAttempts;
	let currentTimeout = 1000;
	let lastError: unknown = null;

	debug('doRequest', url, init);

	if (redirectCount > 20) {
		throw new Error('Too many redirects');
	}

	do {
		try {
			const response = await fetchFn(url, init);
			const redirectUrl = response.headers.get('location');

			if (followRedirects && redirectUrl) {
				return await doRequest({
					url: redirectUrl,
					init: {
						...init,
						method: 'GET',
						body: undefined,
					},
					fetchFn,
					waitFn,
					followRedirects,
					redirectCount: redirectCount + 1,
				});
			} else {
				return response;
			}
		} catch (e) {
			lastError = e;
			if (lastError instanceof GatewayError) {
				tries--;
				currentTimeout = currentTimeout * 2;
				await waitFn(currentTimeout);
			} else {
				break;
			}
		}
	} while (tries > 0);

	throw lastError;
}

function createUserAgent(options: IOptions) {
	const clientVersions: { [clientName: string]: string } = {
		['signageOS_SDK']: parameters.version,
		...options.clientVersions,
	};
	const clients = Object.keys(clientVersions).map(
		(client: string) => `${encodeURIComponent(client)}/${encodeURIComponent(clientVersions[client])}`,
	);
	return clients.join(' ');
}
