import { returnNullOn404 } from '../../../../Lib/request';
import IOptions from '../../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../../requester';
import { getUrl as getPluginVersionUrl } from '../PluginVersionManagement';
import { PluginVersionPlatformArchiveManagement } from './Archive/PluginVersionPlatformArchiveManagement';
import { PluginVersionPlatform } from './PluginVersionPlatform';
import {
	IPluginVersionPlatform,
	IPluginVersionPlatformCreatable,
	IPluginVersionPlatformId,
	IPluginVersionPlatformUpdatable,
} from './IPluginVersionPlatform';

export function getUrl({ pluginUid, version, platform }: { pluginUid: string; version: string; platform?: string }): string {
	return `${getPluginVersionUrl(pluginUid, version)}/platform${platform ? `/${platform}` : ''}`;
}

export class PluginVersionPlatformManagement {
	public readonly archive: PluginVersionPlatformArchiveManagement;

	constructor(private options: IOptions) {
		this.archive = new PluginVersionPlatformArchiveManagement(options);
	}

	public async list({ pluginUid, version }: { pluginUid: string; version: string }): Promise<IPluginVersionPlatform[]> {
		const url = getUrl({ pluginUid, version });
		const response = await getResource(this.options, url);
		const data: IPluginVersionPlatform[] = await parseJSONResponse(response);
		return data.map((item: IPluginVersionPlatform) => new PluginVersionPlatform(item));
	}

	public async get(pluginVersionPlatformId: IPluginVersionPlatformId): Promise<IPluginVersionPlatform | null> {
		return await returnNullOn404(
			(async () => {
				const url = getUrl(pluginVersionPlatformId);
				const response = await getResource(this.options, url);
				return new PluginVersionPlatform(await parseJSONResponse(response));
			})(),
		);
	}

	public async create({
		pluginUid,
		version,
		...data
	}: IPluginVersionPlatformId & IPluginVersionPlatformCreatable): Promise<PluginVersionPlatform> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl({ pluginUid, version });
		const response = await postResource(options, url, JSON.stringify(data));
		return new PluginVersionPlatform(await parseJSONResponse(response));
	}

	public async update({
		pluginUid,
		version,
		platform,
		...data
	}: IPluginVersionPlatformId & IPluginVersionPlatformUpdatable): Promise<void> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl({ pluginUid, version, platform });
		await putResource(options, url, JSON.stringify(data));
	}

	public async delete(id: IPluginVersionPlatformId): Promise<void> {
		const url = getUrl(id);
		await deleteResource(this.options, url);
	}
}
