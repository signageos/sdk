import { returnNullOn404 } from '../../../Lib/request';
import IOptions from '../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { getUrl as getPluginUrl } from '../PluginManagement';
import { PluginVersion } from './PluginVersion';
import {
	IPluginVersion,
	IPluginVersionCreatable,
	IPluginVersionId,
	IPluginVersionUpdatable,
} from './IPluginVersion';
import { PluginVersionPlatformManagement } from './Platform/PluginVersionPlatformManagement';

export function getUrl(pluginUid: string, version?: string): string {
	const baseUrl = `${getPluginUrl(pluginUid)}/version`;
	return version ? `${baseUrl}/${version}` : baseUrl;
}

export class PluginVersionManagement {
	public readonly platform: PluginVersionPlatformManagement;

	constructor(private options: IOptions) {
		this.platform = new PluginVersionPlatformManagement(options);
	}

	public async list(pluginUid: string): Promise<IPluginVersion[]> {
		const url = getUrl(pluginUid);
		const response = await getResource(this.options, url);
		const data: IPluginVersion[] = await parseJSONResponse(response);
		return data.map((item: IPluginVersion) => new PluginVersion(item));
	}

	public async get({ pluginUid, version }: IPluginVersionId): Promise<IPluginVersion | null> {
		const url = getUrl(pluginUid, version);

		return returnNullOn404(
			(async () => {
				const response = await getResource(this.options, url);
				return new PluginVersion(await parseJSONResponse(response));
			})(),
		);
	}

	public async create({ pluginUid, ...data }: IPluginVersionId & IPluginVersionCreatable): Promise<PluginVersion> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl(pluginUid);
		const response = await postResource(options, url, JSON.stringify(data));
		return new PluginVersion(await parseJSONResponse(response));
	}

	public async update({ pluginUid, version, ...data }: IPluginVersionId & IPluginVersionUpdatable) {
		const url = getUrl(pluginUid, version);
		await putResource(this.options, url, JSON.stringify(data));
	}

	public async delete({ pluginUid, version }: IPluginVersionId) {
		const url = getUrl(pluginUid, version);
		await deleteResource(this.options, url);
	}
}
