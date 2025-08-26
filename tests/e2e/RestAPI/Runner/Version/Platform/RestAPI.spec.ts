import should from 'should';
import { createApiV1 } from '../../../../../../src';
import { RunnerVersionPlatform } from '../../../../../../src/RestApi/Runner/Version/Platform/RunnerVersionPlatform';
import { opts } from '../../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Runner Version Platform', () => {
	let runnerUid: string;
	const version = '1.0.0';
	const platform = 'tizen';

	before(async () => {
		const runner = await api.runner.create({
			name: 'test-runner',
			title: 'Test Runner',
			description: 'Test runner description',
		});

		runnerUid = runner.uid;

		await api.runner.version.create({
			runnerUid,
			version,
			configDefinition: [],
			input: [],
			output: [],
			description: 'Test version',
		});
	});

	after(async () => {
		await api.runner.delete(runnerUid);
	});

	describe('create', () => {
		it('should create runner version platform', async () => {
			const runnerVersionPlatform = await api.runner.version.platform.create({
				runnerUid,
				version,
				platform,
				mainFile: 'index.js',
				runtime: 'nodejs',
				md5Checksum: 'dummy-checksum',
			});

			should(runnerVersionPlatform.platform).be.equal(platform);
			should(runnerVersionPlatform.mainFile).be.equal('index.js');
			should(runnerVersionPlatform.runtime).be.equal('nodejs');
		});
	});

	describe('list', () => {
		it('should list runner version platforms', async () => {
			const runnerVersionPlatforms = await api.runner.version.platform.list({ runnerUid, version });

			should(runnerVersionPlatforms).be.an.Array();
			should(runnerVersionPlatforms.length).be.greaterThanOrEqual(1);
			should(runnerVersionPlatforms).matchAny(
				(runnerVersionPlatform: RunnerVersionPlatform) => runnerVersionPlatform.platform === platform,
			);
		});
	});

	describe('get', () => {
		it('should get runner version platform', async () => {
			const runnerVersionPlatform = await api.runner.version.platform.get({ runnerUid, version, platform });

			should(runnerVersionPlatform).be.an.instanceOf(RunnerVersionPlatform);
			should(runnerVersionPlatform!.platform).be.equal(platform);
			should(runnerVersionPlatform!.mainFile).be.equal('index.js');
			should(runnerVersionPlatform!.runtime).be.equal('nodejs');
		});

		it('should return null for non-existing runner version platform', async () => {
			const runnerVersionPlatform = await api.runner.version.platform.get({ runnerUid, version, platform: 'non-existing' });
			should(runnerVersionPlatform).be.null();
		});
	});

	describe('update', () => {
		it('should update runner version platform', async () => {
			await api.runner.version.platform.update({
				runnerUid,
				version,
				platform,
				mainFile: 'updated-index.js',
				runtime: 'sh',
				md5Checksum: 'updated-checksum',
			});

			const runnerVersionPlatform = await api.runner.version.platform.get({ runnerUid, version, platform });
			should(runnerVersionPlatform!.mainFile).be.equal('updated-index.js');
			should(runnerVersionPlatform!.runtime).be.equal('sh');
		});
	});

	describe('delete', () => {
		it('should delete runner version platform', async () => {
			await api.runner.version.platform.delete({ runnerUid, version, platform });

			const runnerVersionPlatform = await api.runner.version.platform.get({ runnerUid, version, platform });
			should(runnerVersionPlatform).be.null();
		});
	});
});
