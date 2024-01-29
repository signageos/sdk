import { fillDataToEntity } from '../../mapper';
import IDevicePackage from './IDevicePackage';

export default class DevicePackage implements IDevicePackage {
	// public readonly [P in keyof IDevicePackage]: IDevicePackage[P]; // Generalized TS doesn't support
	public readonly uid: IDevicePackage['uid'];
	public readonly deviceUid: IDevicePackage['deviceUid'];
	public readonly createdAt: IDevicePackage['createdAt'];
	public readonly packageName: IDevicePackage['packageName'];
	public readonly version: IDevicePackage['version'];
	public readonly build: IDevicePackage['build'];
	public readonly succeededAt: IDevicePackage['succeededAt'];
	public readonly failedAt: IDevicePackage['failedAt'];
	public readonly postponedAt: IDevicePackage['postponedAt'];

	constructor(data: IDevicePackage) {
		fillDataToEntity(this, data);
	}
}
