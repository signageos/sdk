import { Request, Response, RequestInit } from 'node-fetch';
import * as FormData from 'form-data';
import { doRequest } from './requester';
import IAppletVersionFile from './Applet/Version/File/IAppletVersionFile';

export namespace StorageResponse {
	export namespace S3 {
		export interface IAppletVersionFile {
			content: NodeJS.ReadableStream;
			type: string;
		}
	}
}

type StorageType = 's3';
type ParseObject = typeof IAppletVersionFile;

export async function postStorage(url: string | Request, fields: any, data: NodeJS.ReadableStream): Promise<Response> {
	const form = new FormData();
	Object.entries<string>(fields).forEach(([k, v]: [string, string]) => {
		form.append(k, v);
	});
	form.append('file', data);

	const init: RequestInit = {
		method: 'POST',
		body: form,
		headers: form.getHeaders(),
	};

	return await doRequest(url, init);
}

export async function parseStorageResponse(
	response: Response,
	options: {
		storage: StorageType,
		parse: ParseObject,
	},
) {
	return await createStorageResponseParser(options.storage, options.parse)(response);
}

function createStorageResponseParser(storage: StorageType, parse: ParseObject) {
	switch (storage) {
		case 's3':
			return createS3ResponseParser(parse);

		default:
			return createDefaultParser();
	}
}

function createS3ResponseParser(parse: ParseObject) {
	switch (parse) {
		case IAppletVersionFile:
			return (response: Response) => ({
				content: response.body,
				type: response.headers.get('Content-Type'),
			}) as StorageResponse.S3.IAppletVersionFile;

		default:
			return createDefaultParser();
	}
}

function createDefaultParser() {
	return async (response: Response) => {
		const body = response.json();
		const headers = response.headers.raw();
		const content = response.text();

		const data = {
			...body,
			...headers,
			rawBodyContent: content,
		};

		return { data };
	};
}
