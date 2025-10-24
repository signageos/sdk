import { Request, Response, RequestInit } from 'node-fetch';
import FormData from 'form-data';
import { doRequest } from './requester';
import IAppletVersionFile from './Applet/Version/File/IAppletVersionFile';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StorageResponse {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	export namespace S3 {
		export interface AppletVersionFile {
			content: NodeJS.ReadableStream;
			type: string;
			hash?: string;
			size?: number;
		}
	}
}

type StorageType = 's3';
type ParseObject = typeof IAppletVersionFile;

export async function postStorage(url: string | Request, fields: any, data: NodeJS.ReadableStream, size: number): Promise<Response> {
	const form = new FormData();
	Object.entries<string>(fields).forEach(([k, v]: [string, string]) => {
		form.append(k, v);
	});
	form.append('file', data, { knownLength: size });

	const init: RequestInit = {
		method: 'POST',
		body: form,
		headers: form.getHeaders(),
	};

	return await doRequest({ url, init });
}

export async function parseStorageResponse(
	response: Response,
	options: {
		storage: StorageType;
		parse: ParseObject;
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
			return (response: Response) =>
				({
					content: response.body,
					type: response.headers.get('Content-Type') ? response.headers.get('Content-Type') : 'application/octet-stream',
					hash: response.headers.get('x-amz-meta-content_md5') ? response.headers.get('x-amz-meta-content_md5') : undefined,
					size: response.headers.get('Content-Length') ? Number.parseInt(response.headers.get('Content-Length') as string) : undefined,
				}) as StorageResponse.S3.AppletVersionFile;

		default:
			return createDefaultParser();
	}
}

function createDefaultParser() {
	return async (response: Response) => {
		const body = await response.json();
		const headers = response.headers.raw();
		const content = await response.text();

		const data = {
			...body,
			...headers,
			rawBodyContent: content,
		};

		return { data };
	};
}
