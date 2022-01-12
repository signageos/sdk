import { getResource, parseJSONResponse } from '../../requester';
import IOptions from '../../IOptions';
import DeviceTelemetry from './DeviceTelemetry';
import { DeviceTelemetryType } from './IDeviceTelemetry';
import { RESOURCE as DEVICE } from "../DeviceManagement";

export default class DeviceTelemetryManagement {
	public static readonly RESOURCE: string = 'telemetry';

	constructor(private options: IOptions) {}

	public async getLatest(deviceUid: string, type: DeviceTelemetryType) {
		const urlParts = [DEVICE, deviceUid, DeviceTelemetryManagement.RESOURCE, type, 'latest'];
		const response = await getResource(this.options, urlParts.join('/'));
		return new DeviceTelemetry(await parseJSONResponse(response));
	}
}
