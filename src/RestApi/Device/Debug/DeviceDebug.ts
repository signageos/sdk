import IDeviceDebug from "./IDeviceDebug";

export default class DeviceDebug implements IDeviceDebug {

	// public readonly [P in keyof IDeviceDebug]: IDeviceDebug[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceDebug['uid'];
	public readonly deviceUid: IDeviceDebug['deviceUid'];
	public readonly appletEnabled: IDeviceDebug['appletEnabled'];
	public readonly nativeEnabled: IDeviceDebug['nativeEnabled'];
	public readonly createdAt: IDeviceDebug['createdAt'];
	public readonly succeededAt: IDeviceDebug['succeededAt'];
	public readonly failedAt: IDeviceDebug['failedAt'];

	constructor(data: IDeviceDebug) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
