import IOptions from '../../../../IOptions';
import { postResource } from '../../../../requester';
import { postStorage } from '../../../../storageRequester';
import { getUrl as getCustomScriptVersionPlatformUrl } from '../CustomScriptVersionPlatformManagement';
import { ICustomScriptVersionPlatformId } from '../ICustomScriptVersionPlatform';

export function getUrl(id: ICustomScriptVersionPlatformId): string {
	return `${getCustomScriptVersionPlatformUrl(id)}/archive`;
}

export interface UploadFile {
	md5Checksum: string;
	stream: NodeJS.ReadableStream;
	size: number;
}

export class CustomScriptVersionPlatformArchiveManagement {
	constructor(private options: IOptions) {}

	public async upload({
		customScriptUid,
		version,
		platform,
		md5Checksum,
		stream,
		size,
	}: ICustomScriptVersionPlatformId & UploadFile): Promise<void> {
		const url = getUrl({ customScriptUid, version, platform });
		const response = await postResource(this.options, url, JSON.stringify({ md5Checksum }));
		const body = await response.json();
		await postStorage(body.upload.request.url, body.upload.request.fields, stream, size);
	}
}
