import * as should from 'should';
import { Api } from "../../../../src/index";
import { opts, RUN_INTEGRATION_TESTS } from "../helper";
import IDevice, { IDeviceUpdatable } from "../../../../src/RestApi/Device/IDevice";
import IDeviceResolution, {
	DeviceResolutionOrientation,
	DeviceResolutionResolution,
	IDeviceResolutionUpdatable,
} from "../../../../src/RestApi/Device/Resolution/IDeviceResolution";

const allowedTimeout = 30000;
const api = new Api(opts);

describe('RestAPI - Device', function () {
	this.timeout(allowedTimeout);

	before(function () {
		// in order to run these tests, fill in auth and RUN_INTEGRATION_TESTS environment variables (please see '../helper.ts' file)
		if (!RUN_INTEGRATION_TESTS || (opts.accountAuth as any).tokenId === '' || (opts.accountAuth as any).token === '') {
			console.warn('you must set auth details in order to run this test');
			this.skip();
		}
	});

	let device: IDevice | undefined;

	it('should get the list of existing devices', async () => {
		const devices = await api.device.list();
		should(Array.isArray(devices)).true();
		should(devices.length > 0).true();

		// save for later tests
		device = devices[0] as IDevice;

		should(device.uid.length > 0).true();
		should(device.name.length > 0).true();
		should(device.pinCode.length === 4).true();
		should(device.organizationUid.length > 0).true();
		should(device.createdAt.getTime() > 0).true();
	});

	it('should get the device  by its uid', async function () {
		if (!device || !device.uid) {
			return this.skip();
		}

		const dvc = await api.device.get(device.uid);
		should.equal(device.uid, dvc.uid);

	});

	it('should update device name', async function () {
		if (!device || !device.uid || !device.name) {
			return this.skip();
		}

		const update: IDeviceUpdatable = { name: device.name };
		if (!device.name.includes('changed by SDK')) {
			update.name += 'changed by SDK';
		}

		await api.device.set(device.uid, update);
		const devices = await api.device.list();
		devices.forEach((dvc: IDevice) => {
			// @ts-ignore potentially undefined uid
			if (dvc.uid === device.uid) {
				should.equal(dvc.name, update.name);
			}
		});
	});

	it('should update device organization', async function () {
		if (!device || !device.uid) {
			return this.skip();
		}

		const update: IDeviceUpdatable = { organizationUid: '7fc1f0cd1b0ae527468fbe6b7a5a98b4cd93872235e11c6aaf' };
		await api.device.set(device.uid, update);
	});

	it('should get list of device screenshots', async function () {
		if (!device || !device.uid) {
			return this.skip();
		}

		const screenshots = await api.device.screenshot.getList(device.uid);
		screenshots.length.should.equal(0);
	});

	it('should request instant screenshot', async function() {
		if (!device || !device.uid) {
			return this.skip();
		}

		await api.device.screenshot.take(device.uid);
	});

	it('should get the device pin code', async function () {
		if (!device || !device.uid) {
			return this.skip();
		}

		const pin = await api.device.pinCode.get(device.uid);
		should.equal(device.uid, pin.deviceUid);
		should.equal(device.pinCode, pin.pinCode);

	});

	it('should set and get the device resolution', async function () {
		if (!device || !device.uid) {
			return this.skip();
		}

		const toSet: IDeviceResolutionUpdatable = {
			orientation: DeviceResolutionOrientation.Landscape,
			resolution: DeviceResolutionResolution.HDReady,
		};
		await api.device.resolution.set(device.uid, toSet);

		const res = await api.device.resolution.list(device.uid);
		should(Array.isArray(res)).true();
		should(res.length > 0).true();
		res.forEach((item: IDeviceResolution) => {
			// @ts-ignore potentially undefined deviceUid
			should.equal(item.deviceUid, device.uid);
			should(item.uid.length > 0).true();
		});

	});

});
