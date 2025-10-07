import { putResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';

export default class DeviceProvisioningManagement {
	constructor(private options: IOptions) {}

	public async deprovision(deviceUid: string): Promise<void> {
		await putResource(this.options, DeviceProvisioningManagement.getUrl(deviceUid), JSON.stringify({}));
	}

	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/deprovision`;
	}
}
