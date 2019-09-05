import IDevicePin from "./IDevicePin";

export default class DevicePin implements IDevicePin {

	// public readonly [P in keyof IDevicePin]: IDevicePin[P]; // Generalized TS doesn't support
	public readonly deviceUid: IDevicePin['deviceUid'];
	public readonly pinCode: IDevicePin['pinCode'];

	constructor(data: IDevicePin) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
