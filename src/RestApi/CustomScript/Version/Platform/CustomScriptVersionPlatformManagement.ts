import { returnNullOn404 } from '../../../../Lib/request';
import IOptions from '../../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../../requester';
import { getUrl as getCustomScriptVersionUrl } from '../CustomScriptVersionManagement';
import { CustomScriptVersionPlatformArchiveManagement } from './Archive/CustomScriptVersionPlatformArchiveManagement';
import { CustomScriptVersionPlatform } from './CustomScriptVersionPlatform';
import {
	ICustomScriptVersionPlatform,
	ICustomScriptVersionPlatformCreatable,
	ICustomScriptVersionPlatformId,
	ICustomScriptVersionPlatformUpdatable,
} from './ICustomScriptVersionPlatform';

export function getUrl({ customScriptUid, version, platform }: { customScriptUid: string; version: string; platform?: string }): string {
	return `${getCustomScriptVersionUrl(customScriptUid, version)}/platform${platform ? `/${platform}` : ''}`;
}

export class CustomScriptVersionPlatformManagement {
	public readonly archive: CustomScriptVersionPlatformArchiveManagement;

	constructor(private options: IOptions) {
		this.archive = new CustomScriptVersionPlatformArchiveManagement(options);
	}

	public async list({ customScriptUid, version }: { customScriptUid: string; version: string }): Promise<ICustomScriptVersionPlatform[]> {
		const url = getUrl({ customScriptUid, version });
		const response = await getResource(this.options, url);
		const data: ICustomScriptVersionPlatform[] = await parseJSONResponse(response);
		return data.map((item: ICustomScriptVersionPlatform) => new CustomScriptVersionPlatform(item));
	}

	public async get(id: ICustomScriptVersionPlatformId): Promise<ICustomScriptVersionPlatform | null> {
		return await returnNullOn404(
			(async () => {
				const url = getUrl(id);
				const response = await getResource(this.options, url);
				return new CustomScriptVersionPlatform(await parseJSONResponse(response));
			})(),
		);
	}

	public async create({
		customScriptUid,
		version,
		...data
	}: ICustomScriptVersionPlatformId & ICustomScriptVersionPlatformCreatable): Promise<CustomScriptVersionPlatform> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl({ customScriptUid, version });
		const response = await postResource(options, url, JSON.stringify(data));
		return new CustomScriptVersionPlatform(await parseJSONResponse(response));
	}

	public async update({
		customScriptUid,
		version,
		platform,
		...data
	}: ICustomScriptVersionPlatformId & ICustomScriptVersionPlatformUpdatable): Promise<void> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl({ customScriptUid, version, platform });
		await putResource(options, url, JSON.stringify(data));
	}

	public async delete(id: ICustomScriptVersionPlatformId): Promise<void> {
		const url = getUrl(id);
		await deleteResource(this.options, url);
	}
}
