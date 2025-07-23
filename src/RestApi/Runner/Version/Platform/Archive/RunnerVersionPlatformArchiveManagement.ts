import IOptions from '../../../../IOptions';
import { parseJSONResponse, postResource } from '../../../../requester';
import { postStorage } from '../../../../storageRequester';

export function getUrl(runnerUid: string, version: string, platform: string): string {
	return `runner/${runnerUid}/version/${version}/platform/${platform}/archive`;
}

export interface UploadFile {
	md5Checksum: string;
	stream: NodeJS.ReadableStream;
	size: number;
}

export class RunnerVersionPlatformArchiveManagement {
	constructor(private options: IOptions) {}

	public async create(runnerUid: string, version: string, platform: string, md5Checksum: string): Promise<{ uploadUrl: string }> {
		const url = getUrl(runnerUid, version, platform);
		const response = await postResource(this.options, url, JSON.stringify({ md5Checksum }));
		return await parseJSONResponse(response);
	}

	public async upload(runnerUid: string, version: string, platform: string, { md5Checksum, stream, size }: UploadFile): Promise<void> {
		const url = getUrl(runnerUid, version, platform);
		const response = await postResource(this.options, url, JSON.stringify({ md5Checksum }));
		const body = await parseJSONResponse(response);
		await postStorage(body.upload.request.url, body.upload.request.fields, stream, size);
	}
}
