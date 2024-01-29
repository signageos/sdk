import { fillDataToEntity } from '../../mapper';
import IDeviceResolution from './IDeviceResolution';

export default class DeviceResolution implements IDeviceResolution {
	// public readonly [P in keyof IDeviceResolution]: IDeviceResolution[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceResolution['uid'];
	public readonly deviceUid: IDeviceResolution['deviceUid'];
	public readonly orientation: IDeviceResolution['orientation'];
	public readonly resolution: IDeviceResolution['resolution'];
	public readonly videoOrientation: IDeviceResolution['videoOrientation'];
	public readonly createdAt: IDeviceResolution['createdAt'];
	public readonly succeededAt: IDeviceResolution['succeededAt'];
	public readonly failedAt: IDeviceResolution['failedAt'];

	constructor(data: IDeviceResolution) {
		fillDataToEntity(this, data);
	}
}
