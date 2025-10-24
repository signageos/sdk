import { IPaginationAndSort } from '../../../Lib/Pagination/pagination';
import { Dependencies } from '../../Dependencies';
import { getResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IDevice from '../IDevice';
import DeviceAlive, { IDeviceAlive, IDeviceAliveList } from './DeviceAlive';

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
	constructor(private readonly dependencies: Dependencies) {}

	public async list({ filter, sort, pagination }: IDeviceAliveListParams): Promise<IDeviceAliveList> {
		const resp = await getResource(this.dependencies.options, `${Resources.Device}/alive`, {
			...(filter ?? {}),
			...(sort ?? {}),
			...(pagination ?? {}),
		});
		return this.dependencies.paginator.getPaginatedListFromResponse(resp, (data: IDeviceAlive) => new DeviceAlive(data));
	}

	public async get({ uid }: IDeviceAliveGetParams) {
		const deviceAliveRow = await getResource(this.dependencies.options, `${Resources.Device}/${uid}/alive`, {});

		return new DeviceAlive(await parseJSONResponse(deviceAliveRow));
	}
}
