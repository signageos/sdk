import { random } from 'faker';

import { IDeviceAlive } from '../../../../src/RestApi/Device/Alive/DeviceAlive';

export const DEVICE_ALIVE_1: IDeviceAlive = {
	uid: random.uuid(),
	aliveAt: new Date('2022-01-01T10:00:00.000Z'),
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
};
export const DEVICE_ALIVE_2: IDeviceAlive = {
	uid: random.uuid(),
	aliveAt: new Date('2022-01-02T10:00:00.000Z'),
	createdAt: new Date('2022-01-02T10:00:00.000Z'),
};
