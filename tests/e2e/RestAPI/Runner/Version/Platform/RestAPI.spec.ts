import should from 'should';
import * as fs from 'fs-extra';
import * as path from 'path';
import { omit } from 'lodash';
import { createApiV1 } from '../../../../../../src';
import { RunnerVersionPlatform } from '../../../../../../src/RestApi/Runner/Version/Platform/RunnerVersionPlatform';
import { opts } from '../../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Runner Version Platform', () => {
	let runnerUid: string;
	const version = '1.0.0';
	const platform = 'tizen';
	const md5Checksum = 'e50e3ab7aded00bb7015eb0c47ccf827';
	const md5ChecksumHex = Buffer.from(md5Checksum, 'base64').toString('hex');

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
		// Clean up platforms first to avoid cascade issues
		try {
			const platforms = await api.runner.version.platform.list({ runnerUid, version });
			for (const platform of platforms) {
				try {
					await api.runner.version.platform.delete({ runnerUid, version, platform: platform.platform });
				} catch {
					// Ignore deletion errors in cleanup
				}
			}
		} catch {
			// Ignore listing errors in cleanup
		}

		// Delete runner version and runner
		try {
			await api.runner.version.delete({ runnerUid, version });
		} catch {
			// Ignore version deletion errors
		}

		try {
			await api.runner.delete(runnerUid);
		} catch {
			// Ignore runner deletion errors in cleanup
		}
	});

	describe('create', () => {
		it('should create runner version platform', async () => {
			// First upload the archive
			const filePath = path.join(__dirname, 'test.zip');
			const size = (await fs.stat(filePath)).size;
			const archiveFileStream = fs.createReadStream(filePath);

			await api.runner.version.platform.archive.upload({
				runnerUid,
				version,
				platform,
				md5Checksum,
				size,
				stream: archiveFileStream,
			});

			// Then create the platform
			const runnerVersionPlatform = await api.runner.version.platform.create({
				runnerUid,
				version,
				platform,
				mainFile: 'index.js',
				runtime: 'nodejs',
				md5Checksum,
			});

			should(runnerVersionPlatform.platform).be.equal(platform);
			should(runnerVersionPlatform.mainFile).be.equal('index.js');
			should(runnerVersionPlatform.runtime).be.equal('nodejs');
			should(runnerVersionPlatform.md5Checksum).be.equal(md5Checksum);
			should(runnerVersionPlatform.archiveUri).match(new RegExp(`/runner/${runnerUid}/${version}/${platform}\\.${md5ChecksumHex}\\.zip$`));
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
			should(omit(runnerVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'index.js',
				runtime: 'nodejs',
				md5Checksum,
			});
			should(runnerVersionPlatform!.archiveUri).match(new RegExp(`/runner/${runnerUid}/${version}/${platform}\\.${md5ChecksumHex}\\.zip$`));
		});

		it('should return null for non-existing runner version platform', async () => {
			const runnerVersionPlatform = await api.runner.version.platform.get({ runnerUid, version, platform: 'webos' });
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
				md5Checksum,
			});

			const runnerVersionPlatform = await api.runner.version.platform.get({ runnerUid, version, platform });
			should(omit(runnerVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'updated-index.js',
				runtime: 'sh',
				md5Checksum,
			});
			should(runnerVersionPlatform!.archiveUri).match(new RegExp(`/runner/${runnerUid}/${version}/${platform}\\.${md5ChecksumHex}\\.zip$`));
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
