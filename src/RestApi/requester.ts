
import fetch, {Request, Response} from 'node-fetch';
import { stringify } from 'querystring';
import { RequestInit } from "node-fetch";
import IOptions from "./IOptions";
import RequestError from "./Error/RequestError";

export function createOptions(method: 'POST' | 'GET' | 'PUT' | 'DELETE', options: IOptions, data?: any): RequestInit {
	return {
		headers: {
			'Content-Type': 'application/json',
			'X-Auth': options.auth.clientId + ':' + options.auth.secret,
		},
		method,
		body: typeof data !== 'undefined' ? JSON.stringify(data) : undefined,
	};
}

export function createUri(options: IOptions, resource: string, queryParams?: any) {
	return [options.url, options.version, resource].join('/')
		+ (typeof queryParams !== 'undefined' ? '?' + stringify(queryParams) : '');
}

export function getResource(options: IOptions, path: string, query?: any) {
	return doRequest(createUri(options, path, query), createOptions('GET', options));
}

export function postResource(options: IOptions, path: string, data: any) {
	return doRequest(createUri(options, path), createOptions('POST', options, data));
}

export function putResource(options: IOptions, path: string, data: any) {
	return doRequest(createUri(options, path), createOptions('PUT', options, data));
}

export function deleteResource(options: IOptions, path: string) {
	return doRequest(createUri(options, path), createOptions('DELETE', options));
}

export async function parseJSONResponse(resp: Response): Promise<any> {
	return JSON.parse(await resp.text(), deserializeJSON);
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

async function doRequest(url: string | Request, init?: RequestInit): Promise<Response> {
	const resp = await fetch(url, init);
	if (resp.status === 200 || resp.status === 201) {
		return resp;
	}

	throw new RequestError(resp.status, await parseJSONResponse(resp));
}
