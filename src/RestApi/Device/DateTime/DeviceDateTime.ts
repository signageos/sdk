import { fillDataToEntity } from '../../mapper';
import IDeviceDateTime from './IDeviceDateTime';

export default class DeviceDateTime implements IDeviceDateTime {
	// public readonly [P in keyof IDeviceDateTime]: IDeviceDateTime[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceDateTime['uid'];
	public readonly deviceUid: IDeviceDateTime['deviceUid'];
	public readonly timestamp: IDeviceDateTime['timestamp'];
	public readonly timezone: IDeviceDateTime['timezone'];
	public readonly createdAt: IDeviceDateTime['createdAt'];
	public readonly failedAt: IDeviceDateTime['failedAt'];

	constructor(data: IDeviceDateTime) {
		fillDataToEntity(this, data);
	}
}
