import IOptions from '../../IOptions';
import IDeviceFilter from '../../Device/IDeviceFilter';
import Device, { IDeviceUpdatable, IDevice } from './Device';
import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';

export default class DeviceManagementV2 {
	constructor(private organizationOptions: IOptions) {}

	public async list(filter: IDeviceFilter = {}): Promise<IDevice[]> {
		const response = await getResource(this.organizationOptions, Resources.Device, filter);
		const data: IDevice[] = await parseJSONResponse(response);

		return data.map((item: IDevice) => new Device(item));
	}

	public async get(deviceUid: IDevice['uid'], filter: IDeviceFilter = {}): Promise<IDevice> {
		const response = await getResource(this.organizationOptions, Resources.Device + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}

	public async set(deviceUid: IDevice['uid'], settings: IDeviceUpdatable) {
		await putResource(this.organizationOptions, `${Resources.Device}/${deviceUid}`, JSON.stringify(settings));
	}
}
