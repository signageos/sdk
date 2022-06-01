import { random } from 'faker';

import { DeviceTelemetryType } from '../../../../src/RestApi/Device/Telemetry/IDeviceTelemetry';
import { ITelemetryItem } from '../../../../src/RestApi/Device/Telemetry/DeviceTelemetryLatest';

export const TELEMETRY_BRIGHTNESS_1 = {
	deviceUid: 'someUid',
	type: DeviceTelemetryType.BRIGHTNESS,
	updatedAt: new Date('2022-01-07T08:56:52.550Z'),
	data: { brightness: 20 },
};

export const DEVICE_TELEMETRY_1: ITelemetryItem<DeviceTelemetryType.OFFLINE_RANGE> = {
	id: random.uuid(),
	updatedAt: new Date('2022-01-01T10:00:00.000Z'),
	data: {
		since: new Date(),
		until: new Date(),
	},
};
export const DEVICE_TELEMETRY_2: ITelemetryItem<DeviceTelemetryType.REMOTE_CONTROL> = {
	id: random.uuid(),
	updatedAt: new Date('2022-01-02T10:00:00.000Z'),
	data: {
		enabled: true,
	},
};
export const DEVICE_TELEMETRY_3: ITelemetryItem<DeviceTelemetryType.OFFLINE_RANGE> = {
	id: random.uuid(),
	updatedAt: new Date('2022-01-03T10:00:00.000Z'),
	data: {
		since: new Date(),
		until: new Date(),
	},
};
