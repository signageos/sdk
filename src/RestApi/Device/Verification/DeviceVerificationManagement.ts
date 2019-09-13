import { getResource, parseJSONResponse, putResource } from "../../requester";
import IOptions from "../../IOptions";
import DeviceVerification from "./DeviceVerification";
import IDeviceVerification, { IDeviceVerificationUpdatable } from "./IDeviceVerification";

const RESOURCE: string = `device/verification`;

export default class DeviceVerificationManagement {

	constructor(private options: IOptions) {
	}

	public async get(deviceVerificationUid: string): Promise<IDeviceVerification> {
		const response = await getResource(this.options, `${RESOURCE}/${deviceVerificationUid}`);

		return new DeviceVerification(await parseJSONResponse(response));
	}

	public async set(settings: IDeviceVerificationUpdatable): Promise<void> {
		await putResource(this.options, RESOURCE, settings);
	}

}
