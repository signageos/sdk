import fetch, { Request, Response, RequestInit, BodyInit } from 'node-fetch';
import { stringify } from 'querystring';
import * as Debug from 'debug';
import IOptions from './IOptions';
import RequestError from './Error/RequestError';
import NotFoundError from './Error/NotFoundError';
import TooMAnyRequestsError from './Error/TooMAnyRequestsError';
import AuthenticationError from './Error/AuthenticationError';
import InternalApiError from './Error/InternalApiError';
import GatewayError from './Error/GatewayError';
import ResponseBodyFormatError from './Error/ResponseBodyFormatError';
import { parameters } from '../parameters';
const debug = Debug('@signageos/sdk:RestApi:requester');

async function createOptions(
	method: 'POST' | 'GET' | 'PUT' | 'DELETE',
	options: IOptions,
	data?: BodyInit | Buffer,
): Promise<RequestInit> {
	const authOptions = typeof options.auth === 'function' ? await options.auth() : options.auth;

	return {
		headers: {
			'Content-Type': options.contentType ?? 'application/json',
			'X-Auth': authOptions.clientId + ':' + authOptions.secret,
		},
		method,
		body: data,
	};
}

function createUri(options: IOptions, resource: string, queryParams?: any) {
	return [options.url, options.version, resource].join('/') + prepareQueryParams(queryParams);
}

export async function getResource(options: IOptions, path: string, query?: any) {
	return await doRequest(createUri(options, path, query), await createOptions('GET', options));
}

export async function postResource(options: IOptions, path: string, data: any, query?: any) {
	return await doRequest(createUri(options, path, query), await createOptions('POST', options, data));
}

export async function putResource(options: IOptions, path: string, data: any, query?: any) {
	return await doRequest(createUri(options, path, query), await createOptions('PUT', options, data));
}

export async function deleteResource(options: IOptions, path: string, query?: any) {
	return await doRequest(createUri(options, path, query), await createOptions('DELETE', options));
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

function deserializeJSON(_key: string, value: any) {
	if (typeof value === 'string') {
		const regexp = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.exec(value);
		if (regexp) {
			return new Date(value);
		}
	}
	return value;
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

export async function doRequest(
	url: string | Request,
	init?: RequestInit,
	fetchFn: (url: string | Request, init?: RequestInit) => Promise<Response> = doFetch,
	waitFn: (timeout: number) => Promise<void> = wait,
): Promise<Response> {
	let tries = parameters.requestMaxAttempts;
	let currentTimeout = 1000;
	let lastError: Error | null = null;

	debug('doRequest', url, init);

	do {
		try {
			return await fetchFn(url, init);
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
