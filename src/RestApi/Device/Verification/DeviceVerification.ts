import IDeviceVerification from "./IDeviceVerification";

export default class DeviceVerification implements IDeviceVerification {

	// public readonly [P in keyof IDeviceVerification]: IDeviceVerification[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceVerification['uid'];
	public readonly deviceUid: IDeviceVerification['deviceUid'];
	public readonly hash: IDeviceVerification['hash'];
	public readonly createdAt: IDeviceVerification['createdAt'];
	public readonly verifiedAt: IDeviceVerification['verifiedAt'];

	constructor(data: IDeviceVerification) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
