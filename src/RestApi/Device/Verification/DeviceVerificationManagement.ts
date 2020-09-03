import { getResource, parseJSONResponse, postResource } from "../../requester";
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

	public async set(settings: IDeviceVerificationUpdatable): Promise<IDeviceVerification> {
		const { headers } = await postResource(this.options, RESOURCE, JSON.stringify(settings));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${RESOURCE}.`);
		}

		const locationParts = headerLocation.split('/');
		const organizationUid = locationParts[locationParts.length - 1];
		return await this.get(organizationUid);
	}

}
