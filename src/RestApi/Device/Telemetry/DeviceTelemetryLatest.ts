import { fillDataToEntity } from '../../mapper';
import IDeviceReadOnly from '../IDevice';
import { LogData, DeviceTelemetryType } from './IDeviceTelemetry';

export interface ITelemetryItem<T extends DeviceTelemetryType> {
	id: string;
	updatedAt: Date;
	data: LogData[T];
}

type TTelemetries = { [T in DeviceTelemetryType]: ITelemetryItem<T> };

export type TTelemetriesByDevice = {
	deviceUid: IDeviceReadOnly['uid'];
	createdAt: IDeviceReadOnly['createdAt'];
	telemetries: TTelemetries;
};

export default class DeviceTelemetryLatest {
	public readonly deviceUid: TTelemetriesByDevice['deviceUid'];
	public readonly createdAt: TTelemetriesByDevice['createdAt'];
	public readonly telemetries: TTelemetriesByDevice['telemetries'];

	constructor(data: TTelemetriesByDevice) {
		fillDataToEntity(this, data);
	}
}
