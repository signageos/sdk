import * as faker from 'faker';
import { IDeviceAutoRecoveryEnabled, IDeviceAutoRecoveryDisabled } from '../../../../src/RestApi/Device/AutoRecovery/DeviceAutoRecovery';
import { DEVICE_1 } from '../Device.fixtures';

export const AUTO_RECOVERY_1: IDeviceAutoRecoveryEnabled = {
	uid: faker.random.uuid(),
	deviceUid: DEVICE_1.uid,
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
	succeededAt: new Date('2022-01-01T10:00:05.000Z'),
	failedAt: null,
	enabled: true,
	healthcheckIntervalMs: 30e3,
};

export const AUTO_RECOVERY_2: IDeviceAutoRecoveryDisabled = {
	uid: faker.random.uuid(),
	deviceUid: DEVICE_1.uid,
	createdAt: new Date('2022-01-01T09:00:00.000Z'),
	succeededAt: new Date('2022-01-01T09:00:05.000Z'),
	failedAt: null,
	enabled: false,
	autoEnableTimeoutMs: 30e3,
};
