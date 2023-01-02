import * as should from 'should';

import { Api } from '../../../../src';
import IDevice, { IDeviceUpdatable } from '../../../../src/RestApi/Device/IDevice';
import IDeviceResolution, {
	DeviceOrientation,
	DeviceResolutionResolution,
	IDeviceResolutionUpdatable,
} from '../../../../src/RestApi/Device/Resolution/IDeviceResolution';
import Organization from '../../../../src/RestApi/Organization/Organization';
import { opts } from '../helper';

const api = new Api(opts);

describe('RestAPI - Device', function () {

	let device: IDevice;
	let secondOrganization: Organization;

	before('create device', async function () {
		device = await api.emulator.create({ organizationUid: opts.organizationUid! });
		const randomString = Math.random().toString(36).substring(7);
		secondOrganization = await api.organization.create({ name: `sdk-test-${randomString}`, title: `SDK test ${randomString}` });
	});

	after('remove organization', async function () {
		await api.organization.delete(secondOrganization.uid);
		await api.emulator.delete(device.uid);
	});

	// TODO: This test is dependency for other tests, this is not good approach
	it('should get the list of existing devices', async () => {
		const devices = await api.device.list();
		should(Array.isArray(devices)).true();
		should(devices.length > 0).true();

		should(devices[0].uid.length > 0).true();
		should(devices[0].name.length > 0).true();
		if (devices[0].pinCode) {
			// If it had time to set the pin code
			should(devices[0].pinCode.length === 4).true();
		} else {
			// By default device has no pin code until it's first-time connected
			should(devices[0].pinCode).null();
		}
		should(devices[0].organizationUid.length > 0).true();
		should(devices[0].createdAt.getTime() > 0).true();
		should(devices[0].supportedResolutions).be.deepEqual([{ width: 1920, height: 1080 }]);
	});

	it('should get the device  by its uid', async function () {
		const dvc = await api.device.get(device.uid);
		should.equal(device.uid, dvc.uid);
	});

	it('should update device name', async function () {
		const update: IDeviceUpdatable = { name: device.name };
		update.name = `changed by SDK - ${Math.random()}`;

		await api.device.set(device.uid, update);
		const devices = await api.device.list();
		devices.forEach((dvc: IDevice) => {
			if (dvc.uid === device?.uid) {
				should.equal(dvc.name, update.name);
			}
		});
	});

	it('should update device organization', async function () {
		await api.device.set(device.uid, { organizationUid: secondOrganization.uid });
		const api2 = secondOrganization.createApiV1();
		const updatedDevice = await api2.device.get(device.uid);
		should(updatedDevice.organizationUid).equal(secondOrganization.uid);
		// Set the organization back to the original one
		await api2.device.set(device.uid, { organizationUid: opts.organizationUid! });
	});

	it('should get list of device screenshots', async function () {
		const screenshots = await api.device.screenshot.getList(device.uid);
		screenshots.length.should.equal(0);
	});

	it('should request instant screenshot', async function () {
		await api.device.screenshot.take(device.uid);
	});

	it.skip('should get the device pin code', async function () {
		// TODO - this test is failing because the device/emulator is not connected and PIN code is not set
		const pin = await api.device.pinCode.get(device.uid);
		should.equal(device.uid, pin.deviceUid);
		should.equal(device.pinCode, pin.pinCode);
	});

	it('should set and get the device resolution', async function () {
		const toSet: IDeviceResolutionUpdatable = {
			orientation: DeviceOrientation.Landscape,
			resolution: DeviceResolutionResolution.HDReady,
		};
		await api.device.resolution.set(device.uid, toSet);

		const res = await api.device.resolution.list(device.uid);
		should(Array.isArray(res)).true();
		should(res.length > 0).true();
		res.forEach((item: IDeviceResolution) => {
			should.equal(item.deviceUid, device?.uid);
			should(item.uid.length > 0).true();
		});
	});
});
