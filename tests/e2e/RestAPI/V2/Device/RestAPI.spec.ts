import should from 'should';

import { createApiV2 } from '../../../../../src';
import { SocketDriver } from '../../../../../src/RestApi/V2/Device/Device';
import { opts } from '../../helper';
import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';

const api = createApiV2(opts);
const apiV1 = new Api(opts);

describe('e2e.RestAPI - Device', function () {
	let testDevice: IDevice;

	before('create test device', async function () {
		testDevice = await apiV1.emulator.create({ organizationUid: opts.organizationUid! });
	});

	after('remove test device', async function () {
		if (testDevice) {
			await apiV1.emulator.delete(testDevice.uid);
		}
	});

	it('should get the list of existing devices', async () => {
		const devices = await api.device.list();
		should(Array.isArray(devices)).true();
		should(devices.length > 0).true();

		// verify our test device is in the list
		const device = devices.find((d) => d.uid === testDevice.uid);

		should(device).be.ok();
		should(device!.uid.length > 0).true();
		should(device!.name.length > 0).true();
		should(device!.organizationUid.length > 0).true();
		should(device!.createdAt.getTime() > 0).true();
	});

	it('should get the device  by its uid', async function () {
		const dvc = await api.device.get(testDevice.uid);
		should.equal(testDevice.uid, dvc.uid);
	});

	it('should set device properties', async function () {
		const settingsCases = [
			{ name: 'test1', connectionMethod: SocketDriver.Http },
			{ name: 'test2', connectionMethod: SocketDriver.Websocket },
			{ name: 'test3' },
			{ connectionMethod: SocketDriver.Websocket },
			{ name: undefined, connectionMethod: SocketDriver.Websocket },
			{ name: 'test6', connectionMethod: undefined },
		];

		for (const settings of settingsCases) {
			await api.device.set(testDevice.uid, settings);
			const result = await api.device.get(testDevice.uid);

			if (settings.name) {
				should(result.name).equal(settings.name);
			}
			if (settings.connectionMethod) {
				should(result.connectionMethod).equal(settings.connectionMethod);
			}
		}
	});
});
