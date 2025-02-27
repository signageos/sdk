import { returnNullOn404 } from '../../../Lib/request';
import IOptions from '../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { getUrl as getCustomScriptUrl } from '../CustomScriptManagement';
import { CustomScriptVersion } from './CustomScriptVersion';
import {
	ICustomScriptVersion,
	ICustomScriptVersionCreatable,
	ICustomScriptVersionId,
	ICustomScriptVersionUpdatable,
} from './ICustomScriptVersion';
import { CustomScriptVersionPlatformManagement } from './Platform/CustomScriptVersionPlatformManagement';

export function getUrl(customScriptUid: string, version?: string): string {
	const baseUrl = `${getCustomScriptUrl(customScriptUid)}/version`;
	return version ? `${baseUrl}/${version}` : baseUrl;
}

export class CustomScriptVersionManagement {
	public readonly platform: CustomScriptVersionPlatformManagement;

	constructor(private options: IOptions) {
		this.platform = new CustomScriptVersionPlatformManagement(options);
	}

	public async list(customScriptUid: string): Promise<ICustomScriptVersion[]> {
		const url = getUrl(customScriptUid);
		const response = await getResource(this.options, url);
		const data: ICustomScriptVersion[] = await parseJSONResponse(response);
		return data.map((item: ICustomScriptVersion) => new CustomScriptVersion(item));
	}

	public async get({ customScriptUid, version }: ICustomScriptVersionId): Promise<ICustomScriptVersion | null> {
		const url = getUrl(customScriptUid, version);

		return returnNullOn404(
			(async () => {
				const response = await getResource(this.options, url);
				return new CustomScriptVersion(await parseJSONResponse(response));
			})(),
		);
	}

	public async create({ customScriptUid, ...data }: ICustomScriptVersionId & ICustomScriptVersionCreatable): Promise<CustomScriptVersion> {
		const options = { ...this.options, followRedirects: true };
		const url = getUrl(customScriptUid);
		const response = await postResource(options, url, JSON.stringify(data));
		return new CustomScriptVersion(await parseJSONResponse(response));
	}

	public async update({ customScriptUid, version, ...data }: ICustomScriptVersionId & ICustomScriptVersionUpdatable) {
		const url = getUrl(customScriptUid, version);
		await putResource(this.options, url, JSON.stringify(data));
	}

	public async delete({ customScriptUid, version }: ICustomScriptVersionId) {
		const url = getUrl(customScriptUid, version);
		await deleteResource(this.options, url);
	}
}
