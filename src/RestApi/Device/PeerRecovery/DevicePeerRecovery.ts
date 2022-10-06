import { fillDataToEntity } from '../../mapper';
import { IDeviceActionLog } from '../Telemetry/IDeviceTelemetry';

export interface IDevicePeerRecovery extends IDeviceActionLog {
	enabled: boolean;
	autoEnableTimeoutMs?: number;
}

export default class DevicePeerRecovery implements IDevicePeerRecovery {
	public readonly uid: IDevicePeerRecovery['uid'];
	public readonly deviceUid: IDevicePeerRecovery['deviceUid'];
	public readonly createdAt: IDevicePeerRecovery['createdAt'];
	public readonly succeededAt: IDevicePeerRecovery['succeededAt'];
	public readonly failedAt: IDevicePeerRecovery['failedAt'];
	public readonly enabled: IDevicePeerRecovery['enabled'];
	public readonly autoEnableTimeoutMs: IDevicePeerRecovery['autoEnableTimeoutMs'];

	constructor(data: IDevicePeerRecovery) {
		fillDataToEntity(this, data);
	}
}
