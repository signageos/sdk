import { getResource, parseJSONResponse, putResource } from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IOptions from "../../IOptions";
import DeviceDebug from "./DeviceDebug";
import IDeviceDebug, { IDeviceDebugUpdatable } from "./IDeviceDebug";

export default class DeviceDebugManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/debug`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceDebug[]> {
		const response = await getResource(this.options, DeviceDebugManagement.getUrl(deviceUid));
		const data: IDeviceDebug[] = await parseJSONResponse(response);

		return data.map((item: IDeviceDebug) => new DeviceDebug(item));
	}

	public async set(deviceUid: string, settings: IDeviceDebugUpdatable): Promise<void> {
		await putResource(this.options, DeviceDebugManagement.getUrl(deviceUid), settings);
	}

}
