import { getResource, parseJSONResponse, putResource } from '../../requester';
import IOptions from '../../IOptions';
import { Resources } from '../../resources';
import DeviceAppVersion from './DeviceAppVersion';
import IDeviceAppVersion, { IDeviceAppVersionUpdatable } from './IDeviceAppVersion';

export default class DeviceAppVersionManagement {
	constructor(private options: IOptions) {}

	public async get(deviceUid: string): Promise<IDeviceAppVersion> {
		const urlParts = [Resources.Device, deviceUid, 'application', 'version'];
		const response = await getResource(this.options, urlParts.join('/'));
		return new DeviceAppVersion(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceAppVersionUpdatable): Promise<void> {
		const urlParts = [Resources.Device, deviceUid, 'application', settings.applicationType, 'version'];
		await putResource(this.options, urlParts.join('/'), JSON.stringify(settings));
	}
}
