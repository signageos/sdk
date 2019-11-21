import {getResource, parseJSONResponse, putResource, postResource} from "../../requester";
import IFirmwareVersion, {IFirmwareVersionUpdatable, IFirmwareVersionCreatable, IFile} from "./IFirmwareVersion";
import IOptions from "../../IOptions";
import FirmwareVersion from "./FirmwareVersion";
import { postStorage } from "../../storageRequester";
import * as _ from 'lodash';

export default class FirmwareVersionManagement {

	public static readonly RESOURCE: string = 'firmware/version';

	private static getUrl(applicationType: string, version: string): string {
		return `${FirmwareVersionManagement.RESOURCE}/${applicationType}/${version}`;
	}

	constructor(private options: IOptions) {
	}

	public async list(): Promise<IFirmwareVersion[]> {
		const response = await getResource(this.options, FirmwareVersionManagement.RESOURCE);
		const data: IFirmwareVersion[] = await parseJSONResponse(response);

		return data.map((item: IFirmwareVersion) => new FirmwareVersion(item));
	}

	public async set(applicationType: string, version: string , settings: IFirmwareVersionUpdatable): Promise<void> {
		await putResource(this.options, FirmwareVersionManagement.getUrl(applicationType, version), JSON.stringify(settings));
	}

	public async create(settings: IFirmwareVersionCreatable): Promise<void> {
		const response = await postResource(this.options, FirmwareVersionManagement.RESOURCE, JSON.stringify({
			applicationType: settings.applicationType,
			version: settings.version,
			hashes: settings.files.map((file: IFile) => file.hash),
		}));

		const bodyArr = await response.json();

		await Promise.all( bodyArr.map((bodyItem: any) => {
			const file = _.find( settings.files, (item: IFile) => item.hash === bodyItem.upload.request.fields['Content-MD5'] );
			if (!file) {
				throw new Error('File not found');
			}
			return postStorage(
				bodyItem.upload.request.url,
				bodyItem.upload.request.fields,
				file.content,
				file.size,
			);
		}));

		await this.set(settings.applicationType, settings.version, { uploaded: true });
	}
}
