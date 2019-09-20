import {getResource, parseJSONResponse, putResource} from "../../requester";
import { RESOURCE as DEVICE } from "../DeviceManagement";
import IDeviceFirmware, {IDeviceFirmwareUpdatable} from "./IDeviceFirmware";
import DeviceFirmware from "./DeviceFirmware";
import IOptions from "../../IOptions";
import DeviceChangeResponse from "../DeviceChangeResponse";
import IDeviceChangeResponse from "../IDeviceChangeResponse";

export default class DeviceFirmwareManagement {

	private static getUrl(deviceUid: string): string {
		return `${DEVICE}/${deviceUid}/firmware`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceFirmware> {
		const response = await getResource(this.options, DeviceFirmwareManagement.getUrl(deviceUid));

		return new DeviceFirmware(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceFirmwareUpdatable): Promise<IDeviceChangeResponse> {
		const response = await putResource(this.options, DeviceFirmwareManagement.getUrl(deviceUid), JSON.stringify(settings));

		return new DeviceChangeResponse(await parseJSONResponse(response));
	}

}
