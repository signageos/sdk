import { random, date } from 'faker';

import { IDeviceAlive } from '../../../../../src/RestApi/Device/Alive/DeviceAlive';

const createDeviceAlive = (customFields?: Partial<IDeviceAlive>) => {
	const deviceAlive: IDeviceAlive = {
		uid: random.uuid(),
		aliveAt: date.past(),
		createdAt: date.past(),
		...customFields,
	};

	return deviceAlive;
};

export const DEVICE_ALIVE_1 = createDeviceAlive();
export const DEVICE_ALIVE_2 = createDeviceAlive();
