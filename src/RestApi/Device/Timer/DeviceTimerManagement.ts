import {getResource, parseJSONResponse, putResource} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceTimer, {IDeviceTimerUpdatable} from "./IDeviceTimer";
import DeviceTimer from "./DeviceTimer";

export default class DeviceTimerManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/timer-settings`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceTimer> {
		const response = await getResource(this.options, DeviceTimerManagement.getUrl(deviceUid));

		return new DeviceTimer(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceTimerUpdatable): Promise<void> {
		await putResource(this.options, DeviceTimerManagement.getUrl(deviceUid), settings);
	}

}
