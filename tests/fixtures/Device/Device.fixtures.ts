import { random } from 'faker';

import IDevice from '../../../src/RestApi/Device/IDevice';
import { ORGANIZATION_UID_1 } from '../Organization/organization.fixtures';
import { APPLICATION_TYPE_1 } from '../Application/Application.fixtures';

// If the DEVICE fixtures dont have valid organizationUid they will not work for e2e tests
export const DEVICE_1: IDevice = {
	uid: random.uuid(),
	name: 'Display 1',
	createdAt: new Date('2022-01-22T14:00:00.000Z'),
	aliveAt: new Date('2022-01-22T14:00:01.000Z'),
	pinCode: '6648',
	applicationType: 'android',
	applicationVersion: '2.3.0',
	frontDisplayVersion: '3.1.0',
	firmwareVersion: '0.6.2',
	model: 'rk30sdk-PN_B_series',
	serialNumber: '8F047121',
	timezone: null,
	organizationUid: 'f4dc88XXXXXXfba4c',
	networkInterfaces: {
		ethernet: {
			macAddress: '80:38:96:C9:8C:80',
		},
	},
	storageStatus: {
		internal: {
			capacity: 6128599040,
			freeSpace: 5961768960,
		},
		removable: {
			capacity: 0,
			freeSpace: 0,
		},
		updatedAt: new Date('2022-01-22T14:30:00.000Z'),
	},
	connections: [],
	batteryStatus: {
		chargeType: 'AC',
		isCharging: true,
		lastChargingTime: new Date('2022-01-22T14:00:00.000Z'),
		percentage: 50,
		updatedAt: new Date('2022-01-22T14:20:00.000Z'),
	},
	currentTime: {
		time: new Date('2022-01-22T14:00:00.000Z'),
		timezone: 'Europe/Prague',
		updatedAt: new Date('2022-01-22T14:30:00.000Z'),
	},
	supportedResolutions: [{ width: 1920, height: 1080 }],
};

export const DEVICE_2: IDevice = {
	name: random.alphaNumeric(10),
	uid: random.uuid(),
	createdAt: new Date('2022-01-01T10:00:00.000Z'),
	aliveAt: new Date('2022-01-01T11:00:00.000Z'),
	pinCode: '2222',
	applicationVersion: '2.3.0',
	frontDisplayVersion: '3.1.0',
	firmwareVersion: '0.6.2',
	model: 'rk30sdk-PN_B_series',
	serialNumber: '8F042222',
	timezone: 'Europe/Prague',
	networkInterfaces: {
		ethernet: {
			macAddress: '80:38:96:C9:8C:22',
		},
	},
	storageStatus: {
		internal: {
			capacity: 6128599040,
			freeSpace: 5961768960,
		},
		removable: {
			capacity: 0,
			freeSpace: 0,
		},
		updatedAt: new Date('2022-01-01T11:00:00.000Z'),
	},
	connections: [],
	batteryStatus: {
		chargeType: 'AC',
		isCharging: true,
		lastChargingTime: new Date('2022-01-01T11:00:00.000Z'),
		percentage: 50,
		updatedAt: new Date('2022-01-01T11:00:00.000Z'),
	},
	currentTime: {
		time: new Date('2022-01-01T12:00:00.000Z'),
		timezone: 'Europe/Prague',
		updatedAt: new Date('2022-01-01T11:00:00.000Z'),
	},
	supportedResolutions: [{ width: 1920, height: 1080 }],
	organizationUid: ORGANIZATION_UID_1,
	applicationType: APPLICATION_TYPE_1,
};
export const DEVICE_3: IDevice = {
	name: random.alphaNumeric(10),
	uid: random.uuid(),
	createdAt: new Date('2022-01-21T10:00:00.000Z'),
	aliveAt: new Date('2022-01-02T11:00:00.000Z'),
	pinCode: '3333',
	applicationVersion: '2.3.0',
	frontDisplayVersion: '3.1.0',
	firmwareVersion: '0.6.2',
	model: 'rk30sdk-PN_B_series',
	serialNumber: '8F043333',
	timezone: 'Europe/Prague',
	networkInterfaces: {
		ethernet: {
			macAddress: '80:38:96:C9:8C:33',
		},
	},
	storageStatus: {
		internal: {
			capacity: 6128599040,
			freeSpace: 5961768960,
		},
		removable: {
			capacity: 0,
			freeSpace: 0,
		},
		updatedAt: new Date('2022-01-02T11:00:00.000Z'),
	},
	connections: [],
	batteryStatus: {
		chargeType: 'AC',
		isCharging: true,
		lastChargingTime: new Date('2022-01-02T11:00:00.000Z'),
		percentage: 50,
		updatedAt: new Date('2022-01-02T11:00:00.000Z'),
	},
	currentTime: {
		time: new Date('2022-01-02T12:00:00.000Z'),
		timezone: 'Europe/Prague',
		updatedAt: new Date('2022-01-02T11:00:00.000Z'),
	},
	supportedResolutions: [{ width: 1920, height: 1080 }],
	organizationUid: ORGANIZATION_UID_1,
	applicationType: APPLICATION_TYPE_1,
};
