import IOptions from '../../IOptions';
import { Resources } from '../../resources';
import { getResource, parseJSONResponse, putResource } from '../../requester';
import { IDeviceActionLog } from '../Telemetry/IDeviceTelemetry';
import {
	IDevicePeerRecoveryEnabledUpdatable,
	IDevicePeerRecoveryDisabledUpdatable,
	DevicePeerRecoveryEnabled,
	DevicePeerRecoveryDisabled,
} from './DevicePeerRecovery';

interface ISetSettings {
	enabled: IDevicePeerRecoveryEnabledUpdatable['enabled'] | IDevicePeerRecoveryDisabledUpdatable['enabled'];
	urlLauncherAddress?: IDevicePeerRecoveryEnabledUpdatable['urlLauncherAddress'];
	autoEnableTimeoutMs?: IDevicePeerRecoveryDisabledUpdatable['autoEnableTimeoutMs'];
}

export default class DevicePeerRecoveryManagement {
	constructor(private options: IOptions) {}

	public async list(deviceUid: IDeviceActionLog['deviceUid']) {
		const peerRecoveries = await getResource(this.options, `${Resources.Device}/${deviceUid}/peer-recovery`);

		const peerRecoveriesParsed: Array<IDevicePeerRecoveryEnabledUpdatable | IDevicePeerRecoveryDisabledUpdatable> =
			await parseJSONResponse(peerRecoveries);

		return peerRecoveriesParsed.map((peerRecovery) => {
			if (peerRecovery.enabled) {
				return new DevicePeerRecoveryEnabled(peerRecovery);
			}
			return new DevicePeerRecoveryDisabled(peerRecovery);
		});
	}

	public async set(deviceUid: IDeviceActionLog['deviceUid'], settings: ISetSettings) {
		await putResource(this.options, `${Resources.Device}/${deviceUid}/peer-recovery`, JSON.stringify(settings));
	}
}
