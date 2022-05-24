import { fillDataToEntity } from '../../mapper';
import IDevice from '../IDevice';

export interface IDeviceAlive {
	uid: IDevice['uid'];
	createdAt: IDevice['createdAt'];
	aliveAt: IDevice['aliveAt'];
}

export default class DeviceAlive implements IDeviceAlive {
	public readonly uid: IDeviceAlive['uid'];
	public readonly createdAt: IDeviceAlive['createdAt'];
	public readonly aliveAt: IDeviceAlive['aliveAt'];

	constructor(data: IDeviceAlive) {
		fillDataToEntity(this, data);
	}
}
