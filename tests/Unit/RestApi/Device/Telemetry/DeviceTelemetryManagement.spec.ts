import * as should from 'should';
import * as nock from 'nock';
import { nockOpts, nockAuthHeader } from '../../helper';
import IDeviceTelemetry, { DeviceTelemetryType } from '../../../../../src/RestApi/Device/Telemetry/IDeviceTelemetry';
import DeviceTelemetryManagement from '../../../../../src/RestApi/Device/Telemetry/DeviceTelemetryManagement';

describe('DeviceTelemetryManagement', () => {
	const brightnessTelemetry = {
		updatedAt: new Date('2022-01-07T08:56:52.550Z'),
		data: { brightness: 20 },
	};

	nock(nockOpts.url, nockAuthHeader)
		.get(`/v1/device/someUid/telemetry/${DeviceTelemetryType.BRIGHTNESS}/latest`)
		.reply(200, brightnessTelemetry);

	const dtm = new DeviceTelemetryManagement(nockOpts);
	const assertTelemetry = (firstTelemetry: IDeviceTelemetry, secondTelemetry: IDeviceTelemetry) => {
		should(firstTelemetry.updatedAt).be.deepEqual(secondTelemetry.updatedAt);
		should(firstTelemetry.data).be.deepEqual(secondTelemetry.data);
	};

	it('should get latest brightness telemetry for given device', async () => {
		const latest = await dtm.getLatest('someUid', DeviceTelemetryType.BRIGHTNESS);
		assertTelemetry(brightnessTelemetry, latest);
	});
});
