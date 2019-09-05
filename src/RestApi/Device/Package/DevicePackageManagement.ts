import { getResource, parseJSONResponse, putResource } from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IDevicePackage, { IDevicePackageUpdatable } from "./IDevicePackage";
import DevicePackage from "./DevicePackage";
import IOptions from "../../IOptions";

export default class DevicePackageManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/package-install`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDevicePackage[]> {
		const response = await getResource(this.options, DevicePackageManagement.getUrl(deviceUid));
		const data: IDevicePackage[] = await parseJSONResponse(response);

		return data.map((item: IDevicePackage) => new DevicePackage(item));
	}

	public async install(deviceUid: string, settings: IDevicePackageUpdatable): Promise<void> {
		await putResource(this.options, DevicePackageManagement.getUrl(deviceUid), settings);
	}

}
