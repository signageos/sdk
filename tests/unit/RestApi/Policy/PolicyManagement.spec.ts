import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, nockAuthHeader1, successRes } from '../helper';
import IPolicy, { IPolicyCreatable, IPolicyUpdatable, IPolicyClonable } from '../../../../src/RestApi/Policy/IPolicy';
import PolicyManagement from '../../../../src/RestApi/Policy/PolicyManagement';

const nockOpts = getNockOpts({});

describe('PolicyManagement', () => {
	const getLocationHeader = (policyUid: string): nock.HttpHeaders => ({
		Location: `${nockOpts.url}/${nockOpts.version}/policy/${policyUid}`,
	});
	const validCreatePolicyRequest: IPolicyCreatable = { name: 'testPolicy', organizationUid: 'signageos' };
	const validUpdatePolicyRequest: IPolicyUpdatable = {
		name: 'testPolicy',
		items: [{ type: 'VOLUME', value: { volume: 80 } }],
		note: 'someImportantNote',
	};
	const validClonePolicyRequest: IPolicyClonable = { name: 'testPolicy2', organizationUid: 'signageos' };

	const originalEmptyPolicy: IPolicy = {
		uid: 'someUid',
		name: 'testPolicy',
		createdAt: new Date('2022-01-07T08:56:52.550Z'),
		items: [],
	};
	const originalPolicy: IPolicy = {
		...originalEmptyPolicy,
		...validUpdatePolicyRequest,
	};
	const clonedPolicy: IPolicy = {
		...originalPolicy,
		uid: 'someUid2',
		name: 'testPolicy2',
		note: 'Cloned from policy testPolicy',
	};

	nock(nockOpts.url, nockAuthHeader1)
		.get('/v1/policy')
		.reply(200, [originalPolicy])
		.get('/v1/policy/someUid')
		.reply(200, originalPolicy)
		.post('/v1/policy', validCreatePolicyRequest)
		.reply(201, successRes, getLocationHeader('someUid'))
		.get('/v1/policy/someUid')
		.reply(200, originalEmptyPolicy)
		.put('/v1/policy/someUid', validUpdatePolicyRequest)
		.reply(200, successRes)
		.put('/v1/policy/someUid/clone', validClonePolicyRequest)
		.reply(201, successRes, getLocationHeader('someUid2'))
		.get('/v1/policy/someUid2')
		.reply(200, clonedPolicy)
		.put('/v1/policy/someUid/archive', { archived: true })
		.reply(204, successRes)
		.put('/v1/policy/someUid/archive', { archived: false })
		.reply(204, successRes);

	const pm = new PolicyManagement(nockOpts);
	const assertPolicy = (firstPolicy: IPolicy, secondPolicy: IPolicy) => {
		should(firstPolicy.uid).be.equal(secondPolicy.uid);
		should(firstPolicy.name).be.equal(secondPolicy.name);
		should(firstPolicy.createdAt).be.deepEqual(secondPolicy.createdAt);
		should(firstPolicy.items).be.deepEqual(secondPolicy.items);
		should(firstPolicy.note).be.equal(secondPolicy.note);
	};

	it('should get policy list', async () => {
		const policyList = await pm.list();
		should(policyList).has.lengthOf(1);
		assertPolicy(policyList[0], originalPolicy);
	});

	it('should get policy by its uid', async () => {
		const policy = await pm.get('someUid');
		assertPolicy(policy, originalPolicy);
	});

	it('should create policy', async () => {
		const policy = await pm.create(validCreatePolicyRequest);
		assertPolicy(policy, originalEmptyPolicy);
	});

	it('should set policy name and items', async () => {
		await should(pm.set('someUid', validUpdatePolicyRequest)).be.fulfilled();
	});

	it('should clone policy', async () => {
		const policy = await pm.clone('someUid', validClonePolicyRequest);
		assertPolicy(policy, clonedPolicy);
	});

	it('should archive policy', async () => {
		await should(pm.archive('someUid')).be.fulfilled();
	});

	it('should unarchive policy', async () => {
		await should(pm.unarchive('someUid')).be.fulfilled();
	});
});
