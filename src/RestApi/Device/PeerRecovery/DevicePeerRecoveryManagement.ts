import IOptions from '../../IOptions';
import { Resources } from '../../resources';
import { getResource, parseJSONResponse, putResource } from '../../requester';
import { IDeviceActionLog } from '../Telemetry/IDeviceTelemetry';
import DevicePeerRecovery, { IDevicePeerRecovery } from './DevicePeerRecovery';

interface ISetSettings {
	enabled: IDevicePeerRecovery['enabled'];
	autoEnableTimeoutMs?: IDevicePeerRecovery['autoEnableTimeoutMs'];
	urlLauncherAddress?: IDevicePeerRecovery['urlLauncherAddress'];
}

export default class DevicePeerRecoveryManagement {
	constructor(private options: IOptions) {}

	public async list(deviceUid: IDeviceActionLog['deviceUid']) {
		const peerRecoveries = await getResource(this.options, `${Resources.Device}/${deviceUid}/peer-recovery`);

		const peerRecoveriesParsed: IDevicePeerRecovery[] = await parseJSONResponse(peerRecoveries);

		return peerRecoveriesParsed.map((peerRecovery) => new DevicePeerRecovery(peerRecovery));
	}

	public async set(deviceUid: IDeviceActionLog['deviceUid'], settings: ISetSettings) {
		await putResource(this.options, `${Resources.Device}/${deviceUid}/peer-recovery`, JSON.stringify(settings));
	}
}
