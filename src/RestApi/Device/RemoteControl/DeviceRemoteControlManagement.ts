import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IDeviceRemoteControl, { IDeviceRemoteControlUpdatable } from './IDeviceRemoteControl';
import IOptions from '../../IOptions';
import DeviceRemoteControl from './DeviceRemoteControl';

export default class DeviceRemoteControlManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/remote-control`;
	}

	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IDeviceRemoteControl[]> {
		const response = await getResource(this.options, DeviceRemoteControlManagement.getUrl(deviceUid));
		const data: IDeviceRemoteControl[] = await parseJSONResponse(response);

		return data.map((item: IDeviceRemoteControl) => new DeviceRemoteControl(item));
	}

	public async set(deviceUid: string, settings: IDeviceRemoteControlUpdatable): Promise<void> {
		await putResource(this.options, DeviceRemoteControlManagement.getUrl(deviceUid), JSON.stringify(settings));
	}
}
