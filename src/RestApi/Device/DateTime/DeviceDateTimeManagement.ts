import { getResource, parseJSONResponse, putResource } from "../../requester";
import { RESOURCE as DEVICE } from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceDateTime, { IDeviceDateTimeUpdatable } from "./IDeviceDateTime";
import DeviceDateTime from "./DeviceDateTime";

export default class DeviceDateTimeManagement {

	private static getUrl(deviceUid: string): string {
		return `${DEVICE}/${deviceUid}/time`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceDateTime[]> {
		const response = await getResource(this.options, DeviceDateTimeManagement.getUrl(deviceUid));
		const data: IDeviceDateTime[] = await parseJSONResponse(response);

		return data.map((item: IDeviceDateTime) => new DeviceDateTime(item));
	}

	public async set(deviceUid: string, settings: IDeviceDateTimeUpdatable): Promise<void> {
		await putResource(this.options, DeviceDateTimeManagement.getUrl(deviceUid), settings);
	}

}
