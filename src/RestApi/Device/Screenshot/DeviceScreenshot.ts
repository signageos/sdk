import { fillDataToEntity } from '../../mapper';
import IDeviceScreenshot from './IDeviceScreenshot';

export default class DeviceScreenshot implements IDeviceScreenshot {

	// public readonly [P in keyof IDevicePin]: IDevicePin[P]; // Generalized TS doesn't support
	public readonly deviceUid: IDeviceScreenshot['deviceUid'];
	public readonly takenAt: IDeviceScreenshot['takenAt'];
	public readonly uri: IDeviceScreenshot['uri'];

	constructor(data: IDeviceScreenshot) {
		fillDataToEntity(this, data);
	}
}
