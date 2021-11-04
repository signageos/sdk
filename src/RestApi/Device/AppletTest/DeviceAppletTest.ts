import IDeviceAppletTest from "./IDeviceAppletTest";

export default class DeviceAppletTest implements IDeviceAppletTest {

	// public readonly [P in keyof IDeviceAppletTest]: IDeviceAppletTest[P]; // Generalized TS doesn't support
	public readonly appletUid: IDeviceAppletTest['appletUid'];
	public readonly appletVersion: IDeviceAppletTest['appletVersion'];
	public readonly deviceUid: IDeviceAppletTest['deviceUid'];
	public readonly createdAt: IDeviceAppletTest['createdAt'];
	public readonly finishedAt: IDeviceAppletTest['finishedAt'];
	public readonly pendingTests: IDeviceAppletTest['pendingTests'];
	public readonly failedTests: IDeviceAppletTest['failedTests'];
	public readonly successfulTests: IDeviceAppletTest['successfulTests'];

	constructor(data: IDeviceAppletTest) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
