import * as should from 'should';
import { Api } from '../../../../../src/index';
import DeviceTelemetry from '../../../../../src/RestApi/Device/Telemetry/DeviceTelemetry';
import { DeviceTelemetryType } from '../../../../../src/RestApi/Device/Telemetry/IDeviceTelemetry';
import { opts, RUN_INTEGRATION_TESTS } from '../../helper';

const allowedTimeout = 10e3;
const api = new Api(opts);

const TEST_DEVICE_UID = 'b7b04e7a8a2092a2d74656ca0eb7a07a74da361e490a3753f1987';

describe('RestAPI - Policy', () => {
	before(function () {
		this.timeout(allowedTimeout);

		// in order to run these tests, fill in auth and RUN_INTEGRATION_TESTS environment variables (please see '../helper.ts' file)
		if (!RUN_INTEGRATION_TESTS || (opts.accountAuth as any).tokenId === '' || (opts.accountAuth as any).token === '') {
			console.warn('you must set auth details in order to run this test');
			this.skip();
		}
	});

	const assertDeviceTelemetry = (deviceTelemetry: DeviceTelemetry) => {
		should(deviceTelemetry).be.ok();
		should(deviceTelemetry!.deviceUid).be.equal(TEST_DEVICE_UID);
		should(deviceTelemetry!.type).be.equal(DeviceTelemetryType.BRIGHTNESS);
		should(deviceTelemetry!.updatedAt).be.Date();
		should(deviceTelemetry!.data).has.ownProperty('brightness').of.Number();
	};

	it('should fetch latest brightness telemetry for given device', async () => {
		const latestBrightness = await api.device.telemetry.getLatest(TEST_DEVICE_UID, DeviceTelemetryType.BRIGHTNESS);
		assertDeviceTelemetry(latestBrightness);
	});
});
