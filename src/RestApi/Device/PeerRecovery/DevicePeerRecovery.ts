import { fillDataToEntity } from '../../mapper';
import { IDeviceActionLog } from '../Telemetry/IDeviceTelemetry';

export interface IDevicePeerRecoveryEnabledUpdatable extends IDeviceActionLog {
	enabled: true;
	urlLauncherAddress: string;
}

export interface IDevicePeerRecoveryDisabledUpdatable extends IDeviceActionLog {
	enabled: false;
	autoEnableTimeoutMs?: number;
}

export interface IDevicePeerRecoveryEnabled extends IDeviceActionLog, IDevicePeerRecoveryEnabledUpdatable {}

export interface IDevicePeerRecoveryDisabled extends IDeviceActionLog, IDevicePeerRecoveryDisabledUpdatable {}

export class DevicePeerRecoveryEnabled implements IDevicePeerRecoveryEnabled {
	public readonly uid: IDevicePeerRecoveryEnabled['uid'];
	public readonly deviceUid: IDevicePeerRecoveryEnabled['deviceUid'];
	public readonly createdAt: IDevicePeerRecoveryEnabled['createdAt'];
	public readonly succeededAt: IDevicePeerRecoveryEnabled['succeededAt'];
	public readonly failedAt: IDevicePeerRecoveryEnabled['failedAt'];
	public readonly enabled: IDevicePeerRecoveryEnabled['enabled'];
	public readonly urlLauncherAddress: IDevicePeerRecoveryEnabled['urlLauncherAddress'];

	constructor(data: IDevicePeerRecoveryEnabled) {
		fillDataToEntity(this, data);
	}
}

export class DevicePeerRecoveryDisabled implements IDevicePeerRecoveryDisabled {
	public readonly uid: IDevicePeerRecoveryDisabled['uid'];
	public readonly deviceUid: IDevicePeerRecoveryDisabled['deviceUid'];
	public readonly createdAt: IDevicePeerRecoveryDisabled['createdAt'];
	public readonly succeededAt: IDevicePeerRecoveryDisabled['succeededAt'];
	public readonly failedAt: IDevicePeerRecoveryDisabled['failedAt'];
	public readonly enabled: IDevicePeerRecoveryDisabled['enabled'];
	public readonly autoEnableTimeoutMs: IDevicePeerRecoveryDisabled['autoEnableTimeoutMs'];

	constructor(data: IDevicePeerRecoveryDisabled) {
		fillDataToEntity(this, data);
	}
}
