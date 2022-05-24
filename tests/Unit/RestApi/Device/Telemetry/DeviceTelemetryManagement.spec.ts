import * as should from 'should';
import * as nock from 'nock';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import IDeviceTelemetry, { DeviceTelemetryType } from '../../../../../src/RestApi/Device/Telemetry/IDeviceTelemetry';
import DeviceTelemetryManagement from '../../../../../src/RestApi/Device/Telemetry/DeviceTelemetryManagement';
import { DEVICE_2, DEVICE_3 } from '../../../../fixtures/Device/Device.fixtures';
import {
	TELEMETRY_BRIGHTNESS_1,
	DEVICE_TELEMETRY_1,
	DEVICE_TELEMETRY_2,
	DEVICE_TELEMETRY_3,
} from '../../../../fixtures/Device/Telemetry/DeviceTelemetry.fixtures';
import { nockOpts, nockAuthHeader } from '../../helper';

const deviceTelemetryManagement = new DeviceTelemetryManagement(nockOpts);

const assertTelemetry = (firstTelemetry: IDeviceTelemetry, secondTelemetry: IDeviceTelemetry) => {
	should(firstTelemetry.updatedAt).be.deepEqual(secondTelemetry.updatedAt);
	should(firstTelemetry.data).be.deepEqual(secondTelemetry.data);
};

describe('Unit.RestApi.Device.Telemetry.DeviceTelemetryManagement', () => {
	it('should get latest brightness telemetry for given device', async () => {
		nock(nockOpts.url, nockAuthHeader)
			.get(`/${ApiVersions.V1}/device/someUid/telemetry/${DeviceTelemetryType.BRIGHTNESS}/latest`)
			.reply(200, TELEMETRY_BRIGHTNESS_1);

		const latest = await deviceTelemetryManagement.getLatest('someUid', DeviceTelemetryType.BRIGHTNESS);

		assertTelemetry(TELEMETRY_BRIGHTNESS_1, latest);
	});

	it('should fetch list', async () => {
		nock(nockOpts.url, nockAuthHeader)
			.get(`/${ApiVersions.V1}/${Resources.Device}/telemetry/latest`)
			.reply(200, [
				{
					deviceUid: DEVICE_2.uid,
					createdAt: DEVICE_2.createdAt,
					telemetries: {
						[DeviceTelemetryType.OFFLINE_RANGE]: DEVICE_TELEMETRY_1,
						[DeviceTelemetryType.REMOTE_CONTROL]: DEVICE_TELEMETRY_2,
					},
				},
				{
					deviceUid: DEVICE_3.uid,
					createdAt: DEVICE_3.createdAt,
					telemetries: {
						[DeviceTelemetryType.OFFLINE_RANGE]: DEVICE_TELEMETRY_3,
					},
				},
			]);

		const devicesTelemetry = await deviceTelemetryManagement.listLatest({});

		should(devicesTelemetry.length).be.eql(2);
	});

	it('should fetch one', async () => {
		nock(nockOpts.url, nockAuthHeader)
			.get(`/${ApiVersions.V1}/${Resources.Device}/${DEVICE_2.uid}/telemetry/latest`)
			.reply(200, {
				deviceUid: DEVICE_2.uid,
				createdAt: DEVICE_2.createdAt,
				telemetries: {
					[DeviceTelemetryType.OFFLINE_RANGE]: DEVICE_TELEMETRY_1,
					[DeviceTelemetryType.REMOTE_CONTROL]: DEVICE_TELEMETRY_2,
				},
			});

		const { deviceUid, createdAt, telemetries } = await deviceTelemetryManagement.getLatestByUid({ uid: DEVICE_2.uid });

		should(deviceUid).be.eql(DEVICE_2.uid);
		should(createdAt).be.eql(DEVICE_2.createdAt);
		should(telemetries).be.deepEqual({
			[DeviceTelemetryType.OFFLINE_RANGE]: DEVICE_TELEMETRY_1,
			[DeviceTelemetryType.REMOTE_CONTROL]: DEVICE_TELEMETRY_2,
		});
	});
});
