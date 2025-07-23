import should from 'should';
import { createApiV1 } from '../../../../src';
import { opts } from '../helper';
import { Runner } from '../../../../src/RestApi/Runner/Runner';

const api = createApiV1(opts);

describe('e2e.RestAPI - Runner', () => {
	let runnerUid: string;

	describe('create', () => {
		it('should create runner', async () => {
			const runner = await api.runner.create({
				name: 'test-runner',
				title: 'Test Runner',
				description: 'Test runner description',
			});

			should(runner.uid).be.not.empty();
			should(runner.name).be.equal('test-runner');
			should(runner.title).be.equal('Test Runner');
			should(runner.description).be.equal('Test runner description');
			should(runner.organizationUid).be.not.empty();

			runnerUid = runner.uid;
		});
	});

	describe('list', () => {
		it('should list runners', async () => {
			const runners = await api.runner.list();

			should(runners).be.an.Array();
			should(runners.length).be.greaterThanOrEqual(1);
			should(runners).matchAny((runner: Runner) => runner.uid === runnerUid);
		});
	});

	describe('get', () => {
		it('should get runner', async () => {
			const runner = await api.runner.get(runnerUid);

			should(runner).be.an.instanceOf(Runner);
			should(runner!.uid).be.equal(runnerUid);
			should(runner!.name).be.equal('test-runner');
			should(runner!.title).be.equal('Test Runner');
			should(runner!.description).be.equal('Test runner description');
		});

		it('should return null for non-existing runner', async () => {
			const runner = await api.runner.get('non-existing-runner');
			should(runner).be.null();
		});
	});

	describe('update', () => {
		it('should update runner', async () => {
			await api.runner.update(runnerUid, {
				name: 'updated-test-runner',
				description: 'Updated description',
			});

			const runner = await api.runner.get(runnerUid);
			should(runner!.name).be.equal('updated-test-runner');
			should(runner!.description).be.equal('Updated description');
		});
	});

	after(async () => {
		await api.runner.delete(runnerUid);
	});
});
