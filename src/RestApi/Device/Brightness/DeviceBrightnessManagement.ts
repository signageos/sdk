import {getResource, parseJSONResponse, putResource} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IDeviceBrightness, {IDeviceBrightnessUpdatable} from "./IDeviceBrightness";
import DeviceBrightness from "./DeviceBrightness";
import IOptions from "../../IOptions";

export default class DeviceBrightnessManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/brightness`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceBrightness> {
		const response = await getResource(this.options, DeviceBrightnessManagement.getUrl(deviceUid));

		return new DeviceBrightness(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceBrightnessUpdatable): Promise<void> {
		await putResource(this.options, DeviceBrightnessManagement.getUrl(deviceUid), settings);
	}

}
