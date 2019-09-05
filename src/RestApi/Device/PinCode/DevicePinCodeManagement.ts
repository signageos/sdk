import {getResource, parseJSONResponse} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IDevicePin from "./IDevicePin";
import DevicePin from "./DevicePin";
import IOptions from "../../IOptions";

export default class DevicePinCodeManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/pin-code`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDevicePin> {
		const response = await getResource(this.options, DevicePinCodeManagement.getUrl(deviceUid));

		return new DevicePin(await parseJSONResponse(response));
	}

}
