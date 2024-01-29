import { fillDataToEntity } from '../../mapper';
import IDeviceAuthentication from './IDeviceAuthentication';

export default class DeviceAuthentication implements IDeviceAuthentication {
	// public readonly [P in keyof IDeviceAuthentication]: IDeviceAuthentication[P]; // Generalized TS doesn't support
	public readonly deviceUid: IDeviceAuthentication['deviceUid'];
	public readonly authHash: IDeviceAuthentication['authHash'];
	public readonly createdAt: IDeviceAuthentication['createdAt'];

	constructor(data: IDeviceAuthentication) {
		fillDataToEntity(this, data);
	}
}
