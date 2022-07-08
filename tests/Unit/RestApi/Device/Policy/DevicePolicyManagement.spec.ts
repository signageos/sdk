import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, nockAuthHeader1, successRes } from '../../helper';
import IDevicePolicy, {
	IDevicePolicyRaw,
	IDevicePolicyAssignable,
} from '../../../../../src/RestApi/Device/Policy/IDevicePolicy';
import DevicePolicyManagement from '../../../../../src/RestApi/Device/Policy/DevicePolicyManagement';

const nockOpts = getNockOpts({});

describe('DevicePolicyManagement', () => {
	const validAssignPolicyToDeviceRequest: IDevicePolicyAssignable = { uid: 'somePolicyUid', priority: 1 };

	const originalDevicePolicyRaw: IDevicePolicyRaw = {
		uid: 'somePolicyUid',
		priority: 1,
		assignedAt: new Date('2022-01-07T08:56:52.550Z'),
	};

	const originalDevicePolicy: IDevicePolicy = {
		deviceUid: 'someDeviceUid',
		policyUid: 'somePolicyUid',
		priority: 1,
		assignedAt: new Date('2022-01-07T08:56:52.550Z'),
	};

	nock(nockOpts.url, nockAuthHeader1)
		.get('/v1/device/someDeviceUid/policy')
		.reply(200, [originalDevicePolicyRaw])
		.post('/v1/device/someDeviceUid/policy', validAssignPolicyToDeviceRequest)
		.reply(201, successRes)
		.delete('/v1/device/someDeviceUid/policy/somePolicyUid')
		.reply(200, successRes);

	const dpm = new DevicePolicyManagement(nockOpts);
	const assertDevicePolicy = (devicePolicy: IDevicePolicy) => {
		should(devicePolicy.deviceUid).be.equal(originalDevicePolicy.deviceUid);
		should(devicePolicy.policyUid).be.equal(originalDevicePolicy.policyUid);
		should(devicePolicy.priority).be.equal(originalDevicePolicy.priority);
		should(devicePolicy.assignedAt).be.deepEqual(originalDevicePolicy.assignedAt);
	};

	it('should get device policy relation list', async () => {
		const devicePolicyList = await dpm.list('someDeviceUid');
		should(devicePolicyList).has.lengthOf(1);
		assertDevicePolicy(devicePolicyList[0]);
	});

	it('should assign policy to device', async () => {
		await should(dpm.assign('someDeviceUid', { uid: 'somePolicyUid', priority: 1 })).be.fulfilled();
	});

	it('should unassign policy from device', async () => {
		await should(dpm.unassign('someDeviceUid', 'somePolicyUid')).be.fulfilled();
	});
});
