import { getResource, parseJSONResponse, putResource } from "../../requester";
import IOptions from "../../IOptions";
import { Resources } from "../../resources";
import DeviceAppVersion from "./DeviceAppVersion";
import IDeviceAppVersion, { IDeviceAppVersionUpdatable } from "./IDeviceAppVersion";

export default class DeviceAppVersionManagement {

	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/application/version`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceAppVersion> {
		const response = await getResource(this.options, DeviceAppVersionManagement.getUrl(deviceUid));

		return new DeviceAppVersion(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceAppVersionUpdatable): Promise<void> {
		await putResource(this.options, DeviceAppVersionManagement.getUrl(deviceUid), JSON.stringify(settings));
	}

}
