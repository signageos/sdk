import IOptions from '../IOptions';
import IDeviceFilter from './IDeviceFilter';
import { IDeviceV2 } from './DeviceV2';
import { getResource, parseJSONResponse } from '../requester';
import { Resources } from '../resources';
import Device from './DeviceV2';

export default class DeviceManagementV2 {

	constructor(private organizationOptions: IOptions) {}

	public async list(filter: IDeviceFilter = {}): Promise<IDeviceV2[]> {
		const response = await getResource(this.organizationOptions, Resources.Device, filter);
		const data: IDeviceV2[] = await parseJSONResponse(response);

		return data.map((item: IDeviceV2) => new Device(item));
	}

	public async get(deviceUid: string, filter: IDeviceFilter = {}): Promise<IDeviceV2> {
		const response = await getResource(this.organizationOptions, Resources.Device + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}
}
