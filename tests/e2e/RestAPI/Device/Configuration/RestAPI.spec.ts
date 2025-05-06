import should from 'should';
import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';
import { opts } from '../../helper';

const api = new Api(opts);

describe('e2e.RestAPI - Device Configuration', () => {
	let device: IDevice;

	describe('Configure telemetry intervals', () => {
		before('create device', async function () {
			device = await api.emulator.create({ organizationUid: opts.organizationUid! });
		});

		after('remove device', async function () {
			await api.emulator.delete(device.uid);
		});

		it('should configure device telemetry check intervals', async () => {
			await api.device.configuration.setTelemetryIntervals(device.uid, { battery: 3600e3 });
			should(true).be.true();
		});

		it('should fail due to invalid property provided', async () => {
			try {
				// @ts-ignore ignore not assignable parameter that is the point of a test
				await api.device.configuration.setTelemetryIntervals(device.uid, { 'battery+': 3600e3 });
				should(true).be.equal('this should not be reached');
			} catch (error: any) {
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

		it('should fail due to invalid value provided', async () => {
			try {
				const ONE_YEAR_IN_MILLISECONDS_PLUS_ONE = 31556926 * 1e3 + 1;
				await api.device.configuration.setTelemetryIntervals(device.uid, { battery: ONE_YEAR_IN_MILLISECONDS_PLUS_ONE });
				should(true).be.equal('this should not be reached');
			} catch (error: any) {
				should(error.message).be.equal(
					`Request failed with status code 400. Body: ${JSON.stringify({
						status: 400,
						message:
							'Invalid request body - battery - Value should be a number greater than or equal to 3600000 (60 minutes in milliseconds) and less than or equal to 2098800000 (583 hours in milliseconds)',
						errorCode: 400301,
						errorName: 'INVALID_BODY_PROPERTIES',
						errorDetail: 'Received invalid body properties battery.',
					})}`,
				);
			}
		});
	});
});
