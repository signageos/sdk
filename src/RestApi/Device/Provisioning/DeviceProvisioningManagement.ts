import { putResource } from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IOptions from "../../IOptions";

export default class DeviceProvisioningManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/deprovision`;
	}

	constructor(private options: IOptions) {
	}

	public async deprovision(deviceUid: string): Promise<void> {
		await putResource(this.options, DeviceProvisioningManagement.getUrl(deviceUid), {});
	}

}
