import { fillDataToEntity } from "../../mapper";
import IDeviceFirmware from "./IDeviceFirmware";

export default class DeviceFirmware implements IDeviceFirmware {

	// public readonly [P in keyof IDeviceFirmware]: IDeviceFirmware[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceFirmware['uid'];
	public readonly deviceUid: IDeviceFirmware['deviceUid'];
	public readonly version: IDeviceFirmware['version'];
	public readonly createdAt: IDeviceFirmware['createdAt'];

	constructor(data: IDeviceFirmware) {
		fillDataToEntity(this, data);
	}
}
