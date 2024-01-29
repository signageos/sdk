import { fillDataToEntity } from '../../mapper';
import IDevicePin from './IDevicePin';

export default class DevicePin implements IDevicePin {
	// public readonly [P in keyof IDevicePin]: IDevicePin[P]; // Generalized TS doesn't support
	public readonly deviceUid: IDevicePin['deviceUid'];
	public readonly pinCode: IDevicePin['pinCode'];

	constructor(data: IDevicePin) {
		fillDataToEntity(this, data);
	}
}
