import IDeviceTime from "./IDeviceTime";

export default class DeviceVolume implements IDeviceTime {

	// public readonly [P in keyof IDeviceTime]: IDeviceTime[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceTime['uid'];
	public readonly deviceUid: IDeviceTime['deviceUid'];
	public readonly timestamp: IDeviceTime['timestamp'];
	public readonly timezone: IDeviceTime['timezone'];
	public readonly createdAt: IDeviceTime['createdAt'];
	public readonly failedAt: IDeviceTime['failedAt'];

	constructor(data: IDeviceTime) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
