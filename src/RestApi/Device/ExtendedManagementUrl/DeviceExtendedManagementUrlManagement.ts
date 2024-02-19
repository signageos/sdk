import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IDeviceExtendedManagementUrl, { IDeviceExtendedManagementUrlUpdatable } from './IExtendedManagementUrl';
import DeviceExtendedManagementUrl from './DeviceExtendedManagementUrl';
import IOptions from '../../IOptions';

export default class DeviceExtendedManagementUrlManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/extended-management`;
	}

	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IDeviceExtendedManagementUrl[]> {
		const response = await getResource(this.options, DeviceExtendedManagementUrlManagement.getUrl(deviceUid));
		const data: IDeviceExtendedManagementUrl[] = await parseJSONResponse(response);

		return data.map((item: IDeviceExtendedManagementUrl) => new DeviceExtendedManagementUrl(item));
	}

	public async set(deviceUid: string, settings: IDeviceExtendedManagementUrlUpdatable): Promise<void> {
		await putResource(this.options, DeviceExtendedManagementUrlManagement.getUrl(deviceUid), JSON.stringify(settings));
	}
}
