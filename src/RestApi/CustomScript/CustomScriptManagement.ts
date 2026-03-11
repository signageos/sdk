import { returnNullOn404 } from '../../Lib/request';
import { Dependencies } from '../Dependencies';
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

	constructor(private readonly dependencies: Dependencies) {
		this.version = new CustomScriptVersionManagement(dependencies.options);
	}

	public async list(): Promise<ICustomScript[]> {
		const response = await getResource(this.dependencies.options, getUrl());
		const data: ICustomScript[] = await parseJSONResponse(response);
		return data.map((item: ICustomScript) => new CustomScript(item));
	}

	public async get(customScriptUid: string): Promise<ICustomScript | null> {
		return await returnNullOn404(
			(async () => {
				const response = await getResource(this.dependencies.options, getUrl(customScriptUid));
				return new CustomScript(await parseJSONResponse(response));
			})(),
		);
	}

	public async create(data: ICustomScriptCreatable): Promise<ICustomScript> {
		const response = await postResource(this.dependencies.options, getUrl(), JSON.stringify(data));
		const locationHeader = response.headers.get('location');

		if (!locationHeader) {
			throw new Error("API didn't return location header for created custom script");
		}

		const customScriptUid = locationHeader.split('/').pop();
		if (!customScriptUid) {
			throw new Error(`Invalid location header: ${locationHeader}`);
		}

		// Wait a bit for eventual consistency before fetching
		await new Promise((resolve) => setTimeout(resolve, 100));

		const customScript = await this.get(customScriptUid);
		if (!customScript) {
			throw new Error(`Custom script ${customScriptUid} was created but could not be retrieved`);
		}

		return customScript;
	}

	public async update(customScriptUid: string, data: ICustomScriptUpdatable) {
		await putResource(this.dependencies.options, getUrl(customScriptUid), JSON.stringify(data));
	}

	public async delete(customScriptUid: string) {
		await deleteResource(this.dependencies.options, getUrl(customScriptUid));
	}
}
