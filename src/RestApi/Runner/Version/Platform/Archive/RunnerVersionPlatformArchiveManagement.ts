import IOptions from '../../../../IOptions';
import { postResource } from '../../../../requester';
import { postStorage } from '../../../../storageRequester';
import { IRunnerVersionPlatformId } from '../IRunnerVersionPlatform';
import { getUrl as getRunnerVersionPlatformUrl } from '../RunnerVersionPlatformManagement';

export function getUrl(id: IRunnerVersionPlatformId): string {
	return `${getRunnerVersionPlatformUrl(id)}/archive`;
}

export interface UploadFile {
	md5Checksum: string;
	stream: NodeJS.ReadableStream;
	size: number;
}

export class RunnerVersionPlatformArchiveManagement {
	constructor(private options: IOptions) {}

	public async upload({ runnerUid, version, platform, md5Checksum, stream, size }: IRunnerVersionPlatformId & UploadFile): Promise<void> {
		const url = getUrl({ runnerUid, version, platform });
		const response = await postResource(this.options, url, JSON.stringify({ md5Checksum }));
		const body = await response.json();
		await postStorage(body.upload.request.url, body.upload.request.fields, stream, size);
	}
}
