import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IDeviceBrightness, { IDeviceBrightnessUpdatable } from './IDeviceBrightness';
import DeviceBrightness from './DeviceBrightness';
import IOptions from '../../IOptions';

export default class DeviceBrightnessManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/brightness`;
	}

	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IDeviceBrightness[]> {
		const response = await getResource(this.options, DeviceBrightnessManagement.getUrl(deviceUid));
		const data: IDeviceBrightness[] = await parseJSONResponse(response);

		return data.map((item: IDeviceBrightness) => new DeviceBrightness(item));
	}

	public async set(deviceUid: string, settings: IDeviceBrightnessUpdatable): Promise<void> {
		await putResource(this.options, DeviceBrightnessManagement.getUrl(deviceUid), JSON.stringify(settings));
	}
}
