import should from 'should';
import { createApiV1 } from '../../../../../src';
import { RunnerVersion } from '../../../../../src/RestApi/Runner/Version/RunnerVersion';
import { opts } from '../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Runner Version', () => {
	let runnerUid: string;
	const version = '1.0.0';

	before(async () => {
		const runner = await api.runner.create({
			name: 'test-runner',
			title: 'Test Runner',
			description: 'Test runner description',
		});

		runnerUid = runner.uid;
	});

	after(async () => {
		await api.runner.delete(runnerUid);
	});

	describe('create', () => {
		it('should create runner version', async () => {
			const configDefinition = [
				{
					name: 'timeout',
					type: 'number',
					default: 30,
					min: 1,
					max: 300,
					description: 'Task execution timeout in seconds',
				},
				{
					name: 'verbose',
					type: 'boolean',
					default: false,
					description: 'Enable verbose logging',
				},
			];

			const input = [
				{
					name: 'dataInput',
					type: 'string',
					required: true,
					description: 'Input data for processing',
				},
			];

			const output = [
				{
					name: 'result',
					type: 'object',
					description: 'Processing result',
				},
			];

			const runnerVersion = await api.runner.version.create({
				runnerUid,
				version,
				configDefinition,
				input,
				output,
				description: 'Test runner version',
			});

			should(runnerVersion.runnerUid).be.equal(runnerUid);
			should(runnerVersion.version).be.equal(version);
			should(runnerVersion.configDefinition).deepEqual(configDefinition);
			should(runnerVersion.input).deepEqual(input);
			should(runnerVersion.output).deepEqual(output);
			should(runnerVersion.description).be.equal('Test runner version');
		});
	});

	describe('list', () => {
		it('should list runner versions', async () => {
			const runnerVersions = await api.runner.version.list(runnerUid);

			should(runnerVersions).be.an.Array();
			should(runnerVersions.length).be.greaterThanOrEqual(1);
			should(runnerVersions).matchAny((runnerVersion: RunnerVersion) => runnerVersion.runnerUid === runnerUid);
		});
	});

	describe('get', () => {
		it('should get runner version', async () => {
			const runnerVersion = await api.runner.version.get({ runnerUid, version });

			should(runnerVersion).be.an.instanceOf(RunnerVersion);
			should(runnerVersion!.runnerUid).be.equal(runnerUid);
			should(runnerVersion!.version).be.equal(version);
			should(runnerVersion!.configDefinition).be.an.Array();
			should(runnerVersion!.input).be.an.Array();
			should(runnerVersion!.output).be.an.Array();
		});

		it('should return null for non-existing runner version', async () => {
			const runnerVersion = await api.runner.version.get({ runnerUid, version: 'non-existing' });
			should(runnerVersion).be.null();
		});
	});

	describe('update', () => {
		it('should update runner version', async () => {
			const updatedConfig = [
				{
					name: 'timeout',
					type: 'number',
					default: 60,
					min: 1,
					max: 600,
					description: 'Updated timeout',
				},
			];

			await api.runner.version.update({
				runnerUid,
				version,
				configDefinition: updatedConfig,
				input: [],
				output: [],
				description: 'Updated description',
			});

			const runnerVersion = await api.runner.version.get({ runnerUid, version });
			should(runnerVersion!.configDefinition).deepEqual(updatedConfig);
			should(runnerVersion!.description).be.equal('Updated description');
		});
	});

	describe('delete', () => {
		it('should delete runner version', async () => {
			await api.runner.version.delete({
				runnerUid,
				version,
			});

			const runnerVersion = await api.runner.version.get({ runnerUid, version });
			should(runnerVersion).be.null();
		});
	});
});
