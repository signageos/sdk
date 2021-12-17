import { fillDataToEntity } from "../mapper";
import IDeviceChangeResponse from "./IDeviceChangeResponse";

export default class DeviceChangeResponse implements IDeviceChangeResponse {

	// public readonly [P in keyof IDeviceDeprovision]: IDeviceDeprovision[P]; // Generalized TS doesn't support
	public readonly message: IDeviceChangeResponse['message'];
	public readonly requestUid: IDeviceChangeResponse['requestUid'];

	constructor(data: IDeviceChangeResponse) {
		fillDataToEntity(this, data);
	}
}
