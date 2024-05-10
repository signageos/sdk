import { IPaginationAndSort } from '../../../Lib/Pagination/pagination';
import IOptions from '../../IOptions';
import { getResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IDevice from '../IDevice';
import DeviceAlive, { IDeviceAlive, IDeviceAliveList } from './DeviceAlive';
import { Paginator } from '../../../Lib/Pagination/paginator';

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
	constructor(
		private options: IOptions,
		private paginator: Paginator,
	) {}

	public async list({ filter, sort, pagination }: IDeviceAliveListParams): Promise<IDeviceAliveList> {
		const resp = await getResource(this.options, `${Resources.Device}/alive`, {
			...(filter ?? {}),
			...(sort ?? {}),
			...(pagination ?? {}),
		});
		return this.paginator.getPaginatedListFromResponse(resp, (data) => new DeviceAlive(data));
	}

	public async get({ uid }: IDeviceAliveGetParams) {
		const deviceAliveRow = await getResource(this.options, `${Resources.Device}/${uid}/alive`, {});

		return new DeviceAlive(await parseJSONResponse(deviceAliveRow));
	}
}
