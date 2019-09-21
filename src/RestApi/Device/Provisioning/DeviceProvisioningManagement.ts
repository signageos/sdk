import { putResource } from "../../requester";
import { RESOURCE as DEVICE } from "../DeviceManagement";
import IOptions from "../../IOptions";

export default class DeviceProvisioningManagement {

	private static getUrl(deviceUid: string): string {
		return `${DEVICE}/${deviceUid}/deprovision`;
	}

	constructor(private options: IOptions) {
	}

	public async deprovision(deviceUid: string): Promise<void> {
		await putResource(this.options, DeviceProvisioningManagement.getUrl(deviceUid), JSON.stringify({}));
	}

}
