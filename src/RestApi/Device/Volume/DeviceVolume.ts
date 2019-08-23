import IDeviceVolume from "./IDeviceVolume";

export default class DeviceVolume implements IDeviceVolume {

	// public readonly [P in keyof IDeviceVolume]: IDeviceVolume[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceVolume['uid'];
	public readonly deviceUid: IDeviceVolume['deviceUid'];
	public readonly volume: IDeviceVolume['volume'];
	public readonly createdAt: IDeviceVolume['createdAt'];
	public readonly succeededAt: IDeviceVolume['succeededAt'];
	public readonly failedAt: IDeviceVolume['failedAt'];

	constructor(data: IDeviceVolume) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
