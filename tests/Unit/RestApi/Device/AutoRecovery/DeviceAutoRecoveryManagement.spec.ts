import * as nock from 'nock';
import * as should from 'should';
import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import { Resources } from '../../../../../src/RestApi/resources';
import { IDeviceAutoRecoveryEnabled, IDeviceAutoRecoveryDisabled } from '../../../../../src/RestApi/Device/AutoRecovery/DeviceAutoRecovery';
import DeviceAutoRecoveryManagement from '../../../../../src/RestApi/Device/AutoRecovery/DeviceAutoRecoveryManagement';
import { DEVICE_1 } from '../../../../fixtures/Device/Device.fixtures';
import { AUTO_RECOVERY_1, AUTO_RECOVERY_2 } from '../../../../fixtures/Device/AutoRecovery/DeviceAutoRecovery.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';

const nockOpts = getNockOpts({});
const deviceAutoRecoveryManagement = new DeviceAutoRecoveryManagement(nockOpts);

const shouldHaveSameProperties = (
	first: IDeviceAutoRecoveryEnabled | IDeviceAutoRecoveryDisabled,
	second: IDeviceAutoRecoveryEnabled | IDeviceAutoRecoveryDisabled,
) => {
	should(first.uid).be.equal(second.uid);
	should(first.deviceUid).be.equal(second.deviceUid);
	should(first.createdAt).be.deepEqual(second.createdAt);
	should(first.succeededAt).be.deepEqual(second.succeededAt);
	should(first.failedAt).be.deepEqual(second.failedAt);
	should(first.enabled).be.equal(second.enabled);
	if (first.enabled && second.enabled) {
		should(first.healthcheckIntervalMs).be.equal(second.healthcheckIntervalMs);
	}
	if (first.enabled === false && second.enabled === false) {
		should(first.autoEnableTimeoutMs).be.equal(second.autoEnableTimeoutMs);
	}
};

describe('Unit.RestApi.Device.AutoRecovery.DeviceAutoRecoveryManagement', () => {
	const FIRST_DEVICE_AUTO_RECOVERY_URI = `/${ApiVersions.V1}/${Resources.Device}/${DEVICE_1.uid}/auto-recovery`;

	it('should get list of device auto recovery changes from action log', async () => {
		const expectedAutoRecoveryList = [AUTO_RECOVERY_1, AUTO_RECOVERY_2];
		nock(nockOpts.url, nockAuthHeader1).get(FIRST_DEVICE_AUTO_RECOVERY_URI).reply(200, expectedAutoRecoveryList);

		const autoRecoveryList = await deviceAutoRecoveryManagement.list(DEVICE_1.uid);
		should(autoRecoveryList).has.lengthOf(2);
		shouldHaveSameProperties(autoRecoveryList[0], expectedAutoRecoveryList[0]);
		shouldHaveSameProperties(autoRecoveryList[1], expectedAutoRecoveryList[1]);
	});

	it('should enable device auto recovery process', async () => {
		const autoRecoveryEnablePayload = { enabled: true, healthcheckIntervalMs: 30e3 } as const;
		nock(nockOpts.url, nockAuthHeader1).put(FIRST_DEVICE_AUTO_RECOVERY_URI, JSON.stringify(autoRecoveryEnablePayload)).reply(200);
		await should(deviceAutoRecoveryManagement.set(DEVICE_1.uid, autoRecoveryEnablePayload)).be.fulfilled();
	});

	it('should disable device auto recovery process', async () => {
		const autoRecoveryDisablePayload = { enabled: false, autoEnableTimeoutMs: 30e3 } as const;
		nock(nockOpts.url, nockAuthHeader1).put(FIRST_DEVICE_AUTO_RECOVERY_URI, JSON.stringify(autoRecoveryDisablePayload)).reply(200);
		await should(deviceAutoRecoveryManagement.set(DEVICE_1.uid, autoRecoveryDisablePayload)).be.fulfilled();
	});
});
