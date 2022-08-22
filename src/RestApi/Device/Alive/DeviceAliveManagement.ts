import { IPaginationAndSort } from '../../../Lib/Pagination/pagination';
import IOptions from '../../IOptions';
import { getResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IDevice from '../IDevice';
import DeviceAlive, { IDeviceAlive } from './DeviceAlive';

interface IDeviceAliveFilter {
	deviceUids?: IDevice['uid'][];
}

interface IDeviceAliveListParams extends IPaginationAndSort {
	filter?: IDeviceAliveFilter;
}

interface IDeviceAliveGetParams {
	uid: IDeviceAlive['uid'];
}

export default class DeviceAliveManagement {
	constructor(private options: IOptions) {}

	public async list({ filter, sort, pagination }: IDeviceAliveListParams) {
		const devicesAlive = await getResource(this.options, `${Resources.Device}/alive`, {
			...(filter ?? {}),
			...(sort ?? {}),
			...(pagination ?? {}),
		});
		const devicesAliveParsed: IDeviceAlive[] = await parseJSONResponse(devicesAlive);

		return devicesAliveParsed.map((deviceAlive) => new DeviceAlive(deviceAlive));
	}

	public async get({ uid }: IDeviceAliveGetParams) {
		const deviceAliveRow = await getResource(this.options, `${Resources.Device}/${uid}/alive`, {});

		return new DeviceAlive(await parseJSONResponse(deviceAliveRow));
	}
}
