import * as should from 'should';
import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';
import { opts } from '../../helper';

const api = new Api(opts);

describe('RestAPI - Device Configuration', () => {
	let device: IDevice;

	describe('Configure telemetry intervals', () => {
		before('create device', async function () {
			device = await api.emulator.create({ organizationUid: opts.organizationUid! });
		});

		after('remove device', async function () {
			await api.emulator.delete(device.uid);
		});

		it('should configure device telemetry check intervals', async () => {
			await api.device.configuration.setTelemetryIntervals(device.uid, { battery: 1500000 });
			should(true).be.true();
		});

		it('should fail due to invalid property provided', async () => {
			try {
				// @ts-ignore ignore not assignable parameter that is the point of a test
				await api.device.configuration.setTelemetryIntervals(device.uid, { 'battery+': 1500000 });
			} catch (error) {
				should(error.message).be.equal(
					`Request failed with status code 400. Body: ${JSON.stringify({
						status: 400,
						message: 'Invalid request body',
						errorCode: 400301,
						errorName: 'INVALID_BODY_PROPERTIES',
						errorDetail: ' Received unrecognized keys battery+.',
					})}`,
				);
			}
		});
	});
});
