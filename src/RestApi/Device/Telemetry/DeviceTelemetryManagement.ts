import { getResource, parseJSONResponse } from '../../requester';
import IOptions from '../../IOptions';
import DeviceTelemetry from './DeviceTelemetry';
import { DeviceTelemetryType } from './IDeviceTelemetry';
import { Resources } from "../../resources";

export default class DeviceTelemetryManagement {
	public static readonly RESOURCE: string = 'telemetry';

	constructor(private options: IOptions) {}

	public async getLatest(deviceUid: string, type: DeviceTelemetryType) {
		const urlParts = [Resources.Device, deviceUid, DeviceTelemetryManagement.RESOURCE, type, 'latest'];
		const response = await getResource(this.options, urlParts.join('/'));
		return new DeviceTelemetry(await parseJSONResponse(response));
	}
}
