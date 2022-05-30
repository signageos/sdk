import { getResource, parseJSONResponse } from '../../requester';
import IOptions from '../../IOptions';
import { Resources } from '../../resources';
import DeviceTelemetry from './DeviceTelemetry';
import { DeviceTelemetryType } from './IDeviceTelemetry';

export default class DeviceTelemetryManagement {
	public static readonly RESOURCE: string = 'telemetry';

	constructor(private options: IOptions) {}

	/**
	 * @description get latest telemetry by type
	 */
	public async getLatest(deviceUid: string, type: DeviceTelemetryType) {
		const urlParts = [Resources.Device, deviceUid, DeviceTelemetryManagement.RESOURCE, type, 'latest'];
		const response = await getResource(this.options, urlParts.join('/'));
		return new DeviceTelemetry(await parseJSONResponse(response));
	}
}
