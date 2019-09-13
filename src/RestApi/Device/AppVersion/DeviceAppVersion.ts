import IDeviceAppVersion from "./IDeviceAppVersion";

export default class DeviceAppVersion implements IDeviceAppVersion {

	// public readonly [P in keyof IDeviceAppVersion]: IDeviceAppVersion[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceAppVersion['uid'];
	public readonly deviceUid: IDeviceAppVersion['deviceUid'];
	public readonly version: IDeviceAppVersion['version'];
	public readonly applicationType: IDeviceAppVersion['applicationType'];
	public readonly createdAt: IDeviceAppVersion['createdAt'];
	public readonly succeededAt: IDeviceAppVersion['succeededAt'];
	public readonly failedAt: IDeviceAppVersion['failedAt'];

	constructor(data: IDeviceAppVersion) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
