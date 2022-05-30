import { ISort } from '../../../Lib/Sort/sort';
import { TPagination } from '../../../Lib/Pagination/pagination';
import IOptions from '../../IOptions';
import { getResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IDevice from '../IDevice';
import DeviceAlive, { IDeviceAlive } from './DeviceAlive';

interface IDeviceAliveFilter {
	deviceUids?: IDevice['uid'][];
}

interface IDeviceAliveListParams {
	filter?: IDeviceAliveFilter;
	sort?: ISort;
	pagination?: TPagination;
}

interface IDeviceAliveGetParams {
	uid: IDeviceAlive['uid'];
}

export default class DeviceAliveManagement {
	constructor(private options: IOptions) {}

	public async list({ filter, sort, pagination }: IDeviceAliveListParams) {
		const devicesAliveRow = await getResource(this.options, `${Resources.Device}/alive`, {
			...(filter ?? {}),
			...(sort ?? {}),
			...(pagination ?? {}),
		});
		const deviceAliveParsed: IDeviceAlive[] = await parseJSONResponse(devicesAliveRow);

		return deviceAliveParsed.map((deviceAlive) => new DeviceAlive(deviceAlive));
	}

	public async get({ uid }: IDeviceAliveGetParams) {
		const deviceAliveRow = await getResource(this.options, `${Resources.Device}/${uid}/alive`, {});

		return new DeviceAlive(await parseJSONResponse(deviceAliveRow));
	}
}
