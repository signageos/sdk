import { returnNullOn404 } from '../../Lib/request';
import { Dependencies } from '../Dependencies';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import { CustomScript } from './CustomScript';
import { ICustomScript, ICustomScriptManagedCreatable, ICustomScriptUpdatable } from './ICustomScript';

export function getUrl(customScriptUid?: string): string {
	const baseUrl = `custom-script/managed`;
	return customScriptUid ? `${baseUrl}/${customScriptUid}` : baseUrl;
}

/**
 * Manages managed (global) custom scripts maintained by signageOS. Reading is available to any organization
 * with the scripts entitlement; creating, updating and deleting is restricted to signageOS admin accounts.
 * Versions of a managed script are managed through the regular `RestApi.customScript.version` resource.
 */
export class CustomScriptManagedManagement {
	constructor(private readonly dependencies: Dependencies) {}

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

	public async create(data: ICustomScriptManagedCreatable): Promise<ICustomScript> {
		const response = await postResource(this.dependencies.options, getUrl(), JSON.stringify(data));
		const locationHeader = response.headers.get('location');

		if (!locationHeader) {
			throw new Error("API didn't return location header for created custom script");
		}

		const customScriptUid = locationHeader.split('/').pop();
		if (!customScriptUid) {
			throw new Error(`Invalid location header: ${locationHeader}`);
		}

		const customScript = await this.get(customScriptUid);
		if (!customScript) {
			throw new Error(`Managed custom script ${customScriptUid} was created but could not be retrieved`);
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
