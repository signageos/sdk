import { random } from 'faker';

import { SocketDriver, IDevice } from '../../../../src/RestApi/V2/Device/Device';
import { LOCATION_1 } from '../../Location/location.fixtures';

export const DEVICE_V2_1: IDevice = {
	uid: random.uuid(),
	name: 'DeviceV2 1',
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
	applicationType: 'default',
	firmwareVersion: '0.6.2',
	model: 'rk30sdk-PN_B_series',
	serialNumber: '8F047121',
	brand: 'Sony',
	organizationUid: 'organization1',
	locationUid: LOCATION_1.uid,
	connectionMethod: SocketDriver.Websocket,
};
export const DEVICE_V2_2: IDevice = {
	uid: random.uuid(),
	name: 'DeviceV2 2',
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
	applicationType: 'default',
	firmwareVersion: '0.6.2',
	model: 'rk30sdk-PN_B_series',
	serialNumber: '8F047121',
	brand: 'Sony',
	organizationUid: 'organization1',
	locationUid: LOCATION_1.uid,
	connectionMethod: SocketDriver.Http,
};
