import should from 'should';
import nock from 'nock';

import { getNockOpts, nockAuthHeader1 } from '../../helper';
import IDevicePolicyStatus from '../../../../../src/RestApi/Device/PolicyStatus/IDevicePolicyStatus';
import DevicePolicyStatusManagement from '../../../../../src/RestApi/Device/PolicyStatus/DevicePolicyStatusManagement';

const nockOpts = getNockOpts({});

describe('DevicePolicyStatusManagement', () => {
	const originalDevicePolicyStatus: IDevicePolicyStatus = {
		deviceUid: 'someDeviceUid',
		policyUid: 'somePolicyUid',
		itemType: 'BRIGHTNESS',
		success: true,
		updatedAt: new Date('2022-01-07T08:56:52.550Z'),
	};

	nock(nockOpts.url, nockAuthHeader1)
		.get('/v1/device/someDeviceUid/policy-status?policyUid=somePolicyUid&itemType=BRIGHTNESS')
		.reply(200, [originalDevicePolicyStatus])
		.get('/v1/device/someDeviceUid/policy-status/somePolicyUid/item/BRIGHTNESS')
		.reply(200, originalDevicePolicyStatus);

	const dpsm = new DevicePolicyStatusManagement(nockOpts);
	const assertDevicePolicyStatus = (devicePolicyStatus: IDevicePolicyStatus) => {
		should(devicePolicyStatus.deviceUid).be.equal(originalDevicePolicyStatus.deviceUid);
		should(devicePolicyStatus.policyUid).be.equal(originalDevicePolicyStatus.policyUid);
		should(devicePolicyStatus.itemType).be.equal(originalDevicePolicyStatus.itemType);
		should(devicePolicyStatus.success).be.equal(originalDevicePolicyStatus.success);
		should(devicePolicyStatus.updatedAt).be.deepEqual(originalDevicePolicyStatus.updatedAt);
	};

	it('should get device policy status list by used filter', async () => {
		const devicePolicyStatusList = await dpsm.list('someDeviceUid', { policyUid: 'somePolicyUid', itemType: 'BRIGHTNESS' });
		should(devicePolicyStatusList).has.lengthOf(1);
		assertDevicePolicyStatus(devicePolicyStatusList[0]);
	});

	it('should get status for given device, policy and item type', async () => {
		await should(dpsm.get('someDeviceUid', { policyUid: 'somePolicyUid', itemType: 'BRIGHTNESS' })).be.fulfilled();
	});
});
