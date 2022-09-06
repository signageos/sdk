import { fillDataToEntity } from '../../mapper';
import { IDeviceActionLog } from '../Telemetry/IDeviceTelemetry';

export interface IDeviceAutoRecoveryEnabledUpdatable {
	enabled: true;
	healthcheckIntervalMs: number;
}

export interface IDeviceAutoRecoveryEnabled extends IDeviceActionLog, IDeviceAutoRecoveryEnabledUpdatable {}

export interface IDeviceAutoRecoveryDisabledUpdatable {
	enabled: false;
	autoEnableTimeoutMs?: number;
}

export interface IDeviceAutoRecoveryDisabled extends IDeviceActionLog, IDeviceAutoRecoveryDisabledUpdatable {}

export class DeviceAutoRecoveryEnabled implements IDeviceAutoRecoveryEnabled {
	public readonly uid: IDeviceAutoRecoveryEnabled['uid'];
	public readonly deviceUid: IDeviceAutoRecoveryEnabled['deviceUid'];
	public readonly createdAt: IDeviceAutoRecoveryEnabled['createdAt'];
	public readonly succeededAt: IDeviceAutoRecoveryEnabled['succeededAt'];
	public readonly failedAt: IDeviceAutoRecoveryEnabled['failedAt'];
	public readonly enabled: IDeviceAutoRecoveryEnabled['enabled'];
	public readonly healthcheckIntervalMs: IDeviceAutoRecoveryEnabled['healthcheckIntervalMs'];

	constructor(data: IDeviceAutoRecoveryEnabled) {
		fillDataToEntity(this, data);
	}
}

export class DeviceAutoRecoveryDisabled implements IDeviceAutoRecoveryDisabled {
	public readonly uid: IDeviceAutoRecoveryDisabled['uid'];
	public readonly deviceUid: IDeviceAutoRecoveryDisabled['deviceUid'];
	public readonly createdAt: IDeviceAutoRecoveryDisabled['createdAt'];
	public readonly succeededAt: IDeviceAutoRecoveryDisabled['succeededAt'];
	public readonly failedAt: IDeviceAutoRecoveryDisabled['failedAt'];
	public readonly enabled: IDeviceAutoRecoveryDisabled['enabled'];
	public readonly autoEnableTimeoutMs: IDeviceAutoRecoveryDisabled['autoEnableTimeoutMs'];

	constructor(data: IDeviceAutoRecoveryDisabled) {
		fillDataToEntity(this, data);
	}
}
