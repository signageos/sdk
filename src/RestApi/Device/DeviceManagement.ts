import IOptions from "../IOptions";
import {getResource, parseJSONResponse} from "../requester";
import IDeviceFilter from "./IDeviceFilter";
import Device from "./Device";
import IDevice from "./IDevice";

export default class DeviceManagement {

	public static readonly RESOURCE: string = 'device';

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string, filter: IDeviceFilter = {}): Promise<IDevice> {
		const response = await getResource(this.options, DeviceManagement.RESOURCE + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}

}
