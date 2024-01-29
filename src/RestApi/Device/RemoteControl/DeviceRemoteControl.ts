import { fillDataToEntity } from '../../mapper';
import IDeviceRemoteControl from './IDeviceRemoteControl';

export default class DeviceRemoteControl implements IDeviceRemoteControl {
	// public readonly [P in keyof IDeviceRemoteControl]: IDeviceRemoteControl[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceRemoteControl['uid'];
	public readonly deviceUid: IDeviceRemoteControl['deviceUid'];
	public readonly enabled: IDeviceRemoteControl['enabled'];
	public readonly createdAt: IDeviceRemoteControl['createdAt'];
	public readonly succeededAt: IDeviceRemoteControl['succeededAt'];
	public readonly failedAt: IDeviceRemoteControl['failedAt'];

	constructor(data: IDeviceRemoteControl) {
		fillDataToEntity(this, data);
	}
}
