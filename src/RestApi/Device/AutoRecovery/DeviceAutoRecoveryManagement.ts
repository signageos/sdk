import IOptions from '../../IOptions';
import { Resources } from '../../resources';
import { getResource, parseJSONResponse, putResource } from '../../requester';
import {
	DeviceAutoRecoveryEnabled,
	DeviceAutoRecoveryDisabled,
	IDeviceAutoRecoveryEnabledUpdatable,
	IDeviceAutoRecoveryDisabledUpdatable,
} from './DeviceAutoRecovery';

export default class DeviceAutoRecoveryManagement {
	constructor(private options: IOptions) {}

	public async list(deviceUid: string) {
		const response = await getResource(this.options, this.getUrl(deviceUid));
		const autoRecoveries: Array<DeviceAutoRecoveryEnabled | DeviceAutoRecoveryDisabled> = await parseJSONResponse(response);
		return autoRecoveries.map((autoRecovery) => {
			if (autoRecovery.enabled) {
				return new DeviceAutoRecoveryEnabled(autoRecovery);
			}
			return new DeviceAutoRecoveryDisabled(autoRecovery);
		});
	}

	public async set(deviceUid: string, settings: IDeviceAutoRecoveryEnabledUpdatable | IDeviceAutoRecoveryDisabledUpdatable) {
		await putResource(this.options, this.getUrl(deviceUid), JSON.stringify(settings));
	}

	private getUrl(deviceUid: string) {
		return `${Resources.Device}/${deviceUid}/auto-recovery`;
	}
}
