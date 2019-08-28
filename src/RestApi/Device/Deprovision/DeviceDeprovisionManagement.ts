import {parseJSONResponse, putResource} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceChangeResponse from "../IDeviceChangeResponse";
import DeviceChangeResponse from "../DeviceChangeResponse";

export default class DeviceDeprovisionManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/deprovision`;
	}

	constructor(private options: IOptions) {
	}

	public async deprovision(deviceUid: string): Promise<IDeviceChangeResponse> {
		const response = await putResource(this.options, DeviceDeprovisionManagement.getUrl(deviceUid), {});

		return new DeviceChangeResponse(await parseJSONResponse(response));
	}

}
