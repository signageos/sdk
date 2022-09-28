import * as should from 'should';
import * as nock from 'nock';

import { errorResp, errorRespMessage, getNockOpts } from '../helper';
import DeviceManagement from '../../../../src/RestApi/Device/DeviceManagement';
import IDevice, { IDeviceUpdatable } from '../../../../src/RestApi/Device/IDevice';
import Device from '../../../../src/RestApi/Device/Device';

const nockOpts = getNockOpts({});

describe('DeviceManagement', () => {
	const validGetResp: IDevice = {
		'uid': 'someUid',
		'name': 'Display 1',
		'createdAt': new Date('2018-07-09T14:53:15.272Z'),
		'aliveAt': new Date('2018-09-04T08:48:07.838Z'),
		'pinCode': '6648',
		'applicationType': 'android',
		'applicationVersion': '2.3.0',
		'frontDisplayVersion': '3.1.0',
		'firmwareVersion': '0.6.2',
		'model': 'rk30sdk-PN_B_series',
		'serialNumber': '8F047121',
		'brand': 'Sony',
		'osVersion': '1.2.3',
		'timezone': null,
		'organizationUid': 'f4dc88XXXXXXfba4c',
		'networkInterfaces': {
			'ethernet': {
				'macAddress': '80:38:96:C9:8C:80',
			},
		},
		'storageStatus': {
			'internal': {
				'capacity': 6128599040,
				'freeSpace': 5961768960,
			},
			'removable': {
				'capacity': 0,
				'freeSpace': 0,
			},
			'updatedAt': new Date('2018-09-04T08:47:45.866Z'),
		},
		'connections': [],
		'batteryStatus': {
			'chargeType': 'AC',
			'isCharging': true,
			'lastChargingTime': new Date('2018-09-04T08:47:26.142Z'),
			'percentage': 50,
			'updatedAt': new Date('2018-09-04T08:47:45.870Z'),
		},
		'currentTime': {
			'time': new Date('2018-09-04T10:19:08.145Z'),
			'timezone': 'Europe/Prague',
			'updatedAt': new Date('2018-09-04T08:47:07.288Z'),
		},
		supportedResolutions: [
			{ width: 1920, height: 1080 },
		],
	};
	const validListResp: IDevice[] = [validGetResp];
	const validSetReq: IDeviceUpdatable = {
		name: 'Conference room screen',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device').reply(200, validListResp)
		.get('/v1/device/someUid').reply(200, validGetResp)
		.get('/v1/device/shouldFail').reply(500, errorResp)
		.put('/v1/device/someUid', validSetReq).reply(200, {volume: 90})
		.put('/v1/device/shouldFail', validSetReq).reply(500, errorResp)
		.put('/v1/device/someUid/organization', { organizationUid: 'testOrgUid1' }).reply(204);

	const dm = new DeviceManagement(nockOpts, nockOpts);

	describe('get device list information', () => {
		it('should parse the response', async () => {
			const devices = await dm.list();
			should.equal(1, devices.length);
			should(devices[0] instanceof Device).true();
			safeObjectOwnPropertyNames(validGetResp).forEach((propName: keyof IDevice) => {
				should.deepEqual(validGetResp[propName], devices[0][propName]);
			});
		});
	});

	describe('get device information', () => {
		it('should parse the response', async () => {
			const device = await dm.get('someUid');
			safeObjectOwnPropertyNames(validGetResp).forEach((propName: keyof IDevice) => {
				should.deepEqual(validGetResp[propName], device[propName]);
			});
		});

		it('should throw error', async () => {
			try {
				await dm.get('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('set device information', () => {
		it('should set device information correctly', async () => {
			await dm.set('someUid', validSetReq);
			await dm.set('someUid', { organizationUid: 'testOrgUid1' });
			should(true).true();
		});

		it('should fail when api returns non 200 status', async () => {
			try {
				await dm.set('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});

function safeObjectOwnPropertyNames<T>(validGetResp: T): (keyof T)[] {
	return Object.getOwnPropertyNames(validGetResp) as (keyof T)[];
}
