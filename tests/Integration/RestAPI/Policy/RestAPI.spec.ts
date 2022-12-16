import * as should from 'should';

import { Api } from '../../../../src';
import Policy from '../../../../src/RestApi/Policy/Policy';
import { opts } from '../helper';

const api = new Api(opts);

describe('RestAPI - Policy', () => {

	const testEmptyPolicyName = `testEmptyPolicy${Date.now()}`;
	const testFilledPolicyName = `testFilledPolicy${Date.now()}`;
	const testClonedPolicyName = `testClonedPolicy${Date.now()}`;
	const testPolicyItems = [{ type: 'VOLUME', value: { volume: 80 } }];

	const assertEmptyPolicy = (policy?: Policy) => {
		should(policy).be.ok();
		should(policy!.uid).be.String();
		should(policy!.name).be.equal(testEmptyPolicyName);
		should(policy!.createdAt).be.Date();
		should(policy!.items).be.deepEqual([]);
	};
	const assertFilledPolicy = (policy?: Policy) => {
		should(policy).be.ok();
		should(policy!.uid).be.String();
		should(policy!.name).be.equal(testFilledPolicyName);
		should(policy!.createdAt).be.Date();
		should(policy!.items).be.deepEqual(testPolicyItems);
	};
	const assertClonedPolicy = (policy?: Policy) => {
		should(policy).be.ok();
		should(policy!.uid).be.ok();
		should(policy!.name).be.equal(testClonedPolicyName);
		should(policy!.createdAt).be.Date();
		should(policy!.items).be.deepEqual(testPolicyItems);
		should(policy!.note).be.equal(`Cloned from policy ${testFilledPolicyName}`);
	};

	let fetchedPolicy: Policy | undefined;

	before('create new policy', async () => {
		fetchedPolicy = await api.policy.create({
			name: testEmptyPolicyName,
			organizationUid: opts.organizationUid!,
		});
	});

	it('should fetch policy list which should contain just created policy', async () => {
		const list = await api.policy.list({ archived: false });
		const policy = list.find(({ name }: Policy) => name === testEmptyPolicyName);
		assertEmptyPolicy(policy);
	});

	it('should fetch just create policy only', async () => {
		const policy = await api.policy.get(fetchedPolicy!.uid);
		assertEmptyPolicy(policy);
	});

	it('should set policy name & items with note', async () => {
		await api.policy.set(fetchedPolicy!.uid, { name: testFilledPolicyName, items: testPolicyItems, note: 'filled' });
		assertFilledPolicy(await api.policy.get(fetchedPolicy!.uid));
	});

	it('should clone policy with new name and same organization', async () => {
		const policy = await api.policy.clone(fetchedPolicy!.uid, {
			name: testClonedPolicyName,
			organizationUid: opts.organizationUid!,
		});
		assertClonedPolicy(policy);
	});

	it('should archive policy', async () => {
		await api.policy.archive(fetchedPolicy!.uid);
		const list = await api.policy.list({ archived: true });
		should(list.some(({ name }: Policy) => name === testFilledPolicyName)).be.true();
	});

	it('should unarchive policy', async () => {
		await api.policy.unarchive(fetchedPolicy!.uid);
		const list = await api.policy.list({ archived: false });
		should(list.some(({ name }: Policy) => name === testFilledPolicyName)).be.true();
	});
});
