
import fetch, { Request, Response } from 'node-fetch';
import { stringify } from 'querystring';
import { RequestInit } from "node-fetch";
import IOptions from "./IOptions";
import RequestError from "./Error/RequestError";
import NotFoundError from "./Error/NotFoundError";
import TooMAnyRequestsError from "./Error/TooMAnyRequestsError";
import AuthenticationError from "./Error/AuthenticationError";
import InternalApiError from "./Error/InternalApiError";

export function createOptions(method: 'POST' | 'GET' | 'PUT' | 'DELETE', options: IOptions, data?: any): RequestInit {
	return {
		headers: {
			'Content-Type': options.contentType ? options.contentType : 'application/json',
			'X-Auth': options.auth.clientId + ':' + options.auth.secret,
		},
		method,
		body: data,
	};
}

export function createUri(options: IOptions, resource: string, queryParams?: any) {
	return [options.url, options.version, resource].join('/') + prepareQueryParams(queryParams);
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

export async function parseJSON(text: string): Promise<any> {
	return JSON.parse(text, deserializeJSON);
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

export async function doRequest(url: string | Request, init?: RequestInit): Promise<Response> {
	const resp = await fetch(url, init);
	if (resp.ok) {
		return resp;
	}

	let body: any = await resp.text();

	try {
		body = await parseJSON(body);
	} catch (error) {
		//Nothing
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
		default:
			throw new RequestError(resp.status, body);
	}
}
