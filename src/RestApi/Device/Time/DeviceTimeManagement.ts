import {getResource, parseJSONResponse, putResource} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceTime, {IDeviceTimeUpdatable} from "./IDeviceTime";
import DeviceTime from "./DeviceTime";

export default class DeviceTimeManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/time`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceTime> {
		const response = await getResource(this.options, DeviceTimeManagement.getUrl(deviceUid));

		return new DeviceTime(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceTimeUpdatable): Promise<void> {
		await putResource(this.options, DeviceTimeManagement.getUrl(deviceUid), settings);
	}

}
