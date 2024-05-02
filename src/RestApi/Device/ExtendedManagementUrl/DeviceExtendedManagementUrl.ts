import { fillDataToEntity } from '../../mapper';
import IDeviceExtendedManagementUrl from './IExtendedManagementUrl';

export default class DeviceExtendedManagementUrl implements IDeviceExtendedManagementUrl {
	// public readonly [P in keyof IDeviceBrightness]: IDeviceBrightness[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceExtendedManagementUrl['uid'];
	public readonly deviceUid: IDeviceExtendedManagementUrl['deviceUid'];
	public readonly url: IDeviceExtendedManagementUrl['url'];
	public readonly createdAt: IDeviceExtendedManagementUrl['createdAt'];
	public readonly succeededAt: IDeviceExtendedManagementUrl['succeededAt'];
	public readonly failedAt: IDeviceExtendedManagementUrl['failedAt'];

	constructor(data: IDeviceExtendedManagementUrl) {
		fillDataToEntity(this, data);
	}
}
