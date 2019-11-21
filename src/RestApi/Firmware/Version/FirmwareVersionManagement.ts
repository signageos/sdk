import {getResource, parseJSONResponse, putResource, postResource} from "../../requester";
import IFirmwareVersion, {IFirmwareVersionUpdatable, IFirmwareVersionCreatable} from "./IFirmwareVersion";
import IOptions from "../../IOptions";
import FirmwareVersion from "./FirmwareVersion";

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
		await postResource(this.options, FirmwareVersionManagement.RESOURCE, JSON.stringify(settings));
	}
}
