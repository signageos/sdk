import { fillDataToEntity } from "../../mapper";
import IDeviceTimer from "./IDeviceTimer";

export default class DeviceTimer implements IDeviceTimer {

	// public readonly [P in keyof IDeviceTimer]: IDeviceTimer[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceTimer['uid'];
	public readonly deviceUid: IDeviceTimer['deviceUid'];
	public readonly type: IDeviceTimer['type'];
	public readonly level: IDeviceTimer['level'];
	public readonly timeOn: IDeviceTimer['timeOn'];
	public readonly timeOff: IDeviceTimer['timeOff'];
	public readonly volume: IDeviceTimer['volume'];
	public readonly weekdays: IDeviceTimer['weekdays'];
	public readonly createdAt: IDeviceTimer['createdAt'];
	public readonly succeededAt: IDeviceTimer['succeededAt'];
	public readonly failedAt: IDeviceTimer['failedAt'];

	constructor(data: IDeviceTimer) {
		fillDataToEntity(this, data);
	}
}
