import * as should from 'should';

import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';
import DeviceTelemetry from '../../../../../src/RestApi/Device/Telemetry/DeviceTelemetry';
import { DeviceTelemetryType } from '../../../../../src/RestApi/Device/Telemetry/IDeviceTelemetry';
import { opts } from '../../helper';

const api = new Api(opts);

describe('RestAPI - Policy', () => {

	let device: IDevice;

	before('create device', async function () {
		device = await api.emulator.create({ organizationUid: opts.organizationUid! });
	});

	after('remove organization', async function () {
		await api.emulator.delete(device.uid);
	});

	const assertDeviceTelemetry = (deviceTelemetry: DeviceTelemetry) => {
		should(deviceTelemetry).be.ok();
		should(deviceTelemetry!.deviceUid).be.equal(device.uid);
		should(deviceTelemetry!.type).be.equal(DeviceTelemetryType.BRIGHTNESS);
		should(deviceTelemetry!.updatedAt).be.Date();
		should(deviceTelemetry!.data).has.ownProperty('brightness').of.Number();
	};

	it.skip('should fetch latest brightness telemetry for given device', async () => {
		const latestBrightness = await api.device.telemetry.getLatest(device.uid, DeviceTelemetryType.BRIGHTNESS);
		assertDeviceTelemetry(latestBrightness);
	});

	it('should throw error on latest brightness telemetry for just created device', async () => {
		await should(api.device.telemetry.getLatest(device.uid, DeviceTelemetryType.BRIGHTNESS)).rejectedWith(
			`Request failed with status code 404. Body: ${JSON.stringify({
				status: 404,
				message: 'Resource not found',
				errorCode: 404135,
				errorName: 'NO_DEVICE_TELEMETRY_LATEST_TO_READ',
				errorDetail: 'No telemetry data found for given device and their type specified in URI path',
			})}`,
		);
	});
});
