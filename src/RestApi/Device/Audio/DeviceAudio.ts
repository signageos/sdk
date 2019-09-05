import IDeviceAudio from "./IDeviceAudio";

export default class DeviceVolume implements IDeviceAudio {

	// public readonly [P in keyof IDeviceAudio]: IDeviceAudio[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceAudio['uid'];
	public readonly deviceUid: IDeviceAudio['deviceUid'];
	public readonly volume: IDeviceAudio['volume'];
	public readonly createdAt: IDeviceAudio['createdAt'];
	public readonly succeededAt: IDeviceAudio['succeededAt'];
	public readonly failedAt: IDeviceAudio['failedAt'];

	constructor(data: IDeviceAudio) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
