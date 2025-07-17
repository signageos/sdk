import { returnNullOn404 } from '../../Lib/request';
import IOptions from '../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { CustomScript } from './CustomScript';
import { ICustomScript, ICustomScriptCreatable, ICustomScriptUpdatable } from './ICustomScript';
import { CustomScriptVersionManagement } from './Version/CustomScriptVersionManagement';

export function getUrl(customScriptUid?: string): string {
	const baseUrl = `custom-script`;
	return customScriptUid ? `${baseUrl}/${customScriptUid}` : baseUrl;
}

export class CustomScriptManagement {
	public readonly version: CustomScriptVersionManagement;

	constructor(private options: IOptions) {
		this.version = new CustomScriptVersionManagement(options);
	}

	public async list(): Promise<ICustomScript[]> {
		const response = await getResource(this.options, getUrl());
		const data: ICustomScript[] = await parseJSONResponse(response);
		return data.map((item: ICustomScript) => new CustomScript(item));
	}

	public async get(customScriptUid: string): Promise<ICustomScript | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.options, getUrl(customScriptUid));
				return new CustomScript(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: ICustomScriptCreatable): Promise<ICustomScript> {
		const options = { ...this.options, followRedirects: true };
		console.log('Creating custom script', JSON.stringify(data));
		const response = await postResource(options, getUrl(), JSON.stringify(data));
		return new CustomScript(await parseJSONResponse(response));
	}

	public async update(customScriptUid: string, data: ICustomScriptUpdatable) {
		await putResource(this.options, getUrl(customScriptUid), JSON.stringify(data));
	}

	public async delete(customScriptUid: string) {
		await deleteResource(this.options, getUrl(customScriptUid));
	}
}
