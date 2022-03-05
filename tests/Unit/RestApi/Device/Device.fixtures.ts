import { random } from 'faker';

import IDevice from '../../../../src/RestApi/Device/IDevice';

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
