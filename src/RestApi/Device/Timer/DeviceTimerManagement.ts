import { getResource, parseJSONResponse, putResource } from "../../requester";
import { RESOURCE as DEVICE } from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceTimer, { IDeviceTimerUpdatable } from "./IDeviceTimer";
import DeviceTimer from "./DeviceTimer";

export default class DeviceTimerManagement {

	private static getUrl(deviceUid: string): string {
		return `${DEVICE}/${deviceUid}/timer-settings`;
	}

	constructor(private options: IOptions) {
	}

	public async list(deviceUid: string): Promise<IDeviceTimer[]> {
		const response = await getResource(this.options, DeviceTimerManagement.getUrl(deviceUid));
		const data: IDeviceTimer[] = await parseJSONResponse(response);

		return data.map((item: IDeviceTimer) => new DeviceTimer(item));
	}

	public async set(deviceUid: string, settings: IDeviceTimerUpdatable): Promise<void> {
		await putResource(this.options, DeviceTimerManagement.getUrl(deviceUid), settings);
	}

}
