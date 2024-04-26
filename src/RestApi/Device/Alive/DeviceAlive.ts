import { fillDataToEntity } from '../../mapper';
import IDevice from '../IDevice';
import { IPaginatedList } from '../../../Lib/Pagination/PaginatedList';

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

export interface IDeviceAliveList extends IPaginatedList<IDeviceAlive> {}
