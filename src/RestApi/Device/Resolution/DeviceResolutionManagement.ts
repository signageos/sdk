import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IDeviceResolution, { IDeviceResolutionUpdatable } from './IDeviceResolution';
import DeviceResolution from './DeviceResolution';
import IOptions from '../../IOptions';

export default class DeviceResolutionManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/resolution`;
	}

	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IDeviceResolution[]> {
		const response = await getResource(this.options, DeviceResolutionManagement.getUrl(deviceUid));
		const data: IDeviceResolution[] = await parseJSONResponse(response);

		return data.map((item: IDeviceResolution) => new DeviceResolution(item));
	}

	public async set(deviceUid: string, settings: IDeviceResolutionUpdatable): Promise<void> {
		await putResource(this.options, DeviceResolutionManagement.getUrl(deviceUid), JSON.stringify(settings));
	}
}
