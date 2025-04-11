import nock from 'nock';
import should from 'should';
import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import DeviceConfigurationManagement from '../../../../../src/RestApi/Device/Configuration/DeviceConfigurationManagement';
import { Resources } from '../../../../../src/RestApi/resources';
import { DEVICE_1 } from '../../../../fixtures/Device/Device.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';

const nockOpts = getNockOpts({});
const deviceConfigurationManagement = new DeviceConfigurationManagement(nockOpts);

describe('Unit.RestApi.Device.Configuration', () => {
	describe('device telemetry intervals', () => {
		it('should configure device telemetry check intervals', async () => {
			nock(nockOpts.url, nockAuthHeader1)
				.put(`/${ApiVersions.V1}/${Resources.Device}/configuration/${DEVICE_1.uid}/telemetry-intervals`)
				.reply(200, { ...DEVICE_1, message: 'OK' });

			await should(deviceConfigurationManagement.setTelemetryIntervals(DEVICE_1.uid, { battery: 180e3 })).be.fulfilled();
		});
	});
});
