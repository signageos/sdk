import {getResource, parseJSONResponse} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceAuthentication from "./IDeviceAuthentication";
import DeviceAuthentication from "./DeviceAuthentication";

export default class DeviceAuthenticationManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/authentication`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceAuthentication> {
		const response = await getResource(this.options, DeviceAuthenticationManagement.getUrl(deviceUid));

		return new DeviceAuthentication(await parseJSONResponse(response));
	}

}
