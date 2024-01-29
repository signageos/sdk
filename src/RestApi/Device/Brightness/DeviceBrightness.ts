import { fillDataToEntity } from '../../mapper';
import IDeviceBrightness from './IDeviceBrightness';

export default class DeviceBrightness implements IDeviceBrightness {
	// public readonly [P in keyof IDeviceBrightness]: IDeviceBrightness[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceBrightness['uid'];
	public readonly deviceUid: IDeviceBrightness['deviceUid'];
	public readonly brightness1: IDeviceBrightness['brightness1'];
	public readonly timeFrom1: IDeviceBrightness['timeFrom1'];
	public readonly brightness2: IDeviceBrightness['brightness2'];
	public readonly timeFrom2: IDeviceBrightness['timeFrom2'];
	public readonly createdAt: IDeviceBrightness['createdAt'];
	public readonly succeededAt: IDeviceBrightness['succeededAt'];
	public readonly failedAt: IDeviceBrightness['failedAt'];

	constructor(data: IDeviceBrightness) {
		fillDataToEntity(this, data);
	}
}
