import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import { putResource } from '../../requester';
import { ITelemetryConfigurationCheckIntervals } from './DeviceConfiguration';

export default class DeviceConfigurationManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/configuration/${deviceUid}`;
	}

	constructor(private options: IOptions) {}

	public async setTelemetryIntervals(deviceUid: string, telemetryIntervals: Partial<ITelemetryConfigurationCheckIntervals>) {
		await putResource(
			this.options,
			`${DeviceConfigurationManagement.getUrl(deviceUid)}/telemetry-intervals`,
			JSON.stringify(telemetryIntervals),
		);
	}
}
