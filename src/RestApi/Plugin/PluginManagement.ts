import { returnNullOn404 } from '../../Lib/request';
import IOptions from '../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { Plugin } from './Plugin';
import { IPlugin, IPluginCreatable, IPluginUpdatable } from './IPlugin';
import { PluginVersionManagement } from './Version/PluginVersionManagement';

export function getUrl(pluginUid?: string): string {
	const baseUrl = `plugin`;
	return pluginUid ? `${baseUrl}/${pluginUid}` : baseUrl;
}

export class PluginManagement {
	public readonly version: PluginVersionManagement;

	constructor(private options: IOptions) {
		this.version = new PluginVersionManagement(options);
	}

	public async list(): Promise<IPlugin[]> {
		const response = await getResource(this.options, getUrl());
		const data: IPlugin[] = await parseJSONResponse(response);
		return data.map((item: IPlugin) => new Plugin(item));
	}

	public async get(pluginUid: string): Promise<IPlugin | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.options, getUrl(pluginUid));
				return new Plugin(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: IPluginCreatable): Promise<IPlugin> {
		const options = { ...this.options, followRedirects: true };
		const response = await postResource(options, 'plugin', JSON.stringify(data));
		return new Plugin(await parseJSONResponse(response));
	}

	public async update(pluginUid: string, data: IPluginUpdatable) {
		await putResource(this.options, getUrl(pluginUid), JSON.stringify(data));
	}

	public async delete(pluginUid: string) {
		await deleteResource(this.options, getUrl(pluginUid));
	}
}
