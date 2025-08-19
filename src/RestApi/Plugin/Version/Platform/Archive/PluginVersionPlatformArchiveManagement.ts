import IOptions from '../../../../IOptions';
import { postResource } from '../../../../requester';
import { postStorage } from '../../../../storageRequester';
import { getUrl as getPluginVersionPlatformUrl } from '../PluginVersionPlatformManagement';
import { IPluginVersionPlatformId } from '../IPluginVersionPlatform';

export function getUrl(id: IPluginVersionPlatformId): string {
	return `${getPluginVersionPlatformUrl(id)}/archive`;
}

export interface UploadFile {
	md5Checksum: string;
	stream: NodeJS.ReadableStream;
	size: number;
}

export class PluginVersionPlatformArchiveManagement {
	constructor(private options: IOptions) {}

	public async upload({ pluginUid, version, platform, md5Checksum, stream, size }: IPluginVersionPlatformId & UploadFile): Promise<void> {
		const url = getUrl({ pluginUid, version, platform });
		const response = await postResource(this.options, url, JSON.stringify({ md5Checksum }));
		const body = await response.json();
		await postStorage(body.upload.request.url, body.upload.request.fields, stream, size);
	}
}
