import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import DeviceDebug from './DeviceDebug';
import IDeviceDebug, { IDeviceDebugUpdatable } from './IDeviceDebug';

export default class DeviceDebugManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/debug`;
	}

	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IDeviceDebug[]> {
		const response = await getResource(this.options, DeviceDebugManagement.getUrl(deviceUid));
		const data: IDeviceDebug[] = await parseJSONResponse(response);

		return data.map((item: IDeviceDebug) => new DeviceDebug(item));
	}

	public async set(deviceUid: string, settings: IDeviceDebugUpdatable): Promise<void> {
		await putResource(this.options, DeviceDebugManagement.getUrl(deviceUid), JSON.stringify(settings));
	}
}
