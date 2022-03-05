import * as should from 'should';

import { Api } from '../../../../../src';
import DeviceTelemetry from '../../../../../src/RestApi/Device/Telemetry/DeviceTelemetry';
import { DeviceTelemetryType } from '../../../../../src/RestApi/Device/Telemetry/IDeviceTelemetry';
import { ALLOWED_TIMEOUT, opts, preRunCheck } from '../../helper';

const api = new Api(opts);

const TEST_DEVICE_UID = 'b7b04e7a8a2092a2d74656ca0eb7a07a74da361e490a3753f1987';

describe('RestAPI - Policy', () => {
	before(function () {
		this.timeout(ALLOWED_TIMEOUT);

		preRunCheck(this.skip.bind(this));
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
