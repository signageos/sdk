import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IDeviceAudio, { IDeviceAudioUpdatable } from './IDeviceAudio';
import DeviceVolume from './DeviceAudio';
import IOptions from '../../IOptions';

export default class DeviceAudioManagement {
	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IDeviceAudio[]> {
		const response = await getResource(this.options, DeviceAudioManagement.getUrl(deviceUid));
		const data: IDeviceAudio[] = await parseJSONResponse(response);

		return data.map((item: IDeviceAudio) => new DeviceVolume(item));
	}

	public async set(deviceUid: string, settings: IDeviceAudioUpdatable): Promise<void> {
		await putResource(this.options, DeviceAudioManagement.getUrl(deviceUid), JSON.stringify(settings));
	}

	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/volume`;
	}
}
