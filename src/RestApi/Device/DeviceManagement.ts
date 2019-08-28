import IOptions from "../IOptions";
import {getResource, parseJSONResponse, putResource} from "../requester";
import IDeviceFilter from "./IDeviceFilter";
import Device from "./Device";
import IDevice, {IDeviceUpdatable} from "./IDevice";

export default class DeviceManagement {

	public static readonly RESOURCE: string = 'device';

	constructor(private options: IOptions) {
	}

	public async list(filter: IDeviceFilter = {}): Promise<IDevice[]> {
		const response = await getResource(this.options, DeviceManagement.RESOURCE, filter);
		const data: IDevice[] = await parseJSONResponse(response);

		return data.map((item: IDevice) => new Device(item));
	}

	public async get(deviceUid: string, filter: IDeviceFilter = {}): Promise<IDevice> {
		const response = await getResource(this.options, DeviceManagement.RESOURCE + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceUpdatable): Promise<void> {
		await putResource(this.options, DeviceManagement.RESOURCE + '/' + deviceUid, settings);
	}

}
