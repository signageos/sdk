import should from 'should';
import * as fs from 'fs-extra';
import * as path from 'path';
import { omit } from 'lodash';
import { createApiV1 } from '../../../../../../src';
import { PluginVersionPlatform } from '../../../../../../src/RestApi/Plugin/Version/Platform/PluginVersionPlatform';
import { opts } from '../../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Plugin Version Platform', () => {
	let pluginUid: string;
	const version = '1.0.0';
	const platform = 'tizen';
	const md5Checksum = 'e50e3ab7aded00bb7015eb0c47ccf827';
	const md5ChecksumHex = Buffer.from(md5Checksum, 'base64').toString('hex');

	before(async () => {
		const plugin = await api.plugin.create({
			name: 'test-plugin',
			title: 'Test Plugin',
			description: 'Test plugin description',
		});

		pluginUid = plugin.uid;

		await api.plugin.version.create({
			pluginUid,
			version,
			description: 'Test plugin version description',
			configDefinition: [],
		});
	});

	after(async () => {
		// Clean up platforms first to avoid cascade issues
		try {
			const platforms = await api.plugin.version.platform.list({ pluginUid, version });
			for (const platform of platforms) {
				try {
					await api.plugin.version.platform.delete({ pluginUid, version, platform: platform.platform });
				} catch {
					// Ignore deletion errors in cleanup
				}
			}
		} catch {
			// Ignore listing errors in cleanup
		}

		// Delete plugin version and plugin
		try {
			await api.plugin.version.delete({ pluginUid, version });
		} catch {
			// Ignore version deletion errors
		}

		try {
			await api.plugin.delete(pluginUid);
		} catch {
			// Ignore plugin deletion errors in cleanup
		}
	});

	describe('create', () => {
		it('should create plugin version platform', async () => {
			// First upload the archive
			const filePath = path.join(__dirname, 'test.zip');
			const size = (await fs.stat(filePath)).size;
			const archiveFileStream = fs.createReadStream(filePath);

			await api.plugin.version.platform.archive.upload({
				pluginUid,
				version,
				platform,
				md5Checksum,
				size,
				stream: archiveFileStream,
			});

			// Then create the platform
			const pluginVersionPlatform = await api.plugin.version.platform.create({
				pluginUid,
				version,
				platform,
				mainFile: 'index.js',
				runtime: 'browser',
				md5Checksum,
			});

			should(omit(pluginVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'index.js',
				runtime: 'browser',
				md5Checksum,
			});
			should(pluginVersionPlatform.archiveUri).match(new RegExp(`/plugin/${pluginUid}/${version}/${platform}\\.${md5ChecksumHex}\\.zip$`));
		});
	});

	describe('list', () => {
		it('should list plugin version platforms', async () => {
			const pluginVersionPlatforms = await api.plugin.version.platform.list({ pluginUid, version });

			should(pluginVersionPlatforms).be.an.Array();
			should(pluginVersionPlatforms.length).be.greaterThanOrEqual(1);
			should(pluginVersionPlatforms).matchAny(
				(pluginVersionPlatform: PluginVersionPlatform) => pluginVersionPlatform.platform === platform,
			);
		});
	});

	describe('get', () => {
		it('should get plugin version platform', async () => {
			const pluginVersionPlatform = await api.plugin.version.platform.get({
				pluginUid,
				version,
				platform,
			});

			should(pluginVersionPlatform).be.an.instanceOf(PluginVersionPlatform);
			should(omit(pluginVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'index.js',
				runtime: 'browser',
				md5Checksum,
			});
			should(pluginVersionPlatform!.archiveUri).match(new RegExp(`/plugin/${pluginUid}/${version}/${platform}\\.${md5ChecksumHex}\\.zip$`));
		});

		it('should return null for non-existing plugin version platform', async () => {
			const pluginVersionPlatform = await api.plugin.version.platform.get({
				pluginUid,
				version,
				platform: 'webos',
			});
			should(pluginVersionPlatform).be.null();
		});
	});

	describe('update', () => {
		it('should update plugin version platform', async () => {
			await api.plugin.version.platform.update({
				pluginUid,
				version,
				platform,
				mainFile: 'updated-index.js',
				runtime: 'nodejs',
				md5Checksum,
			});

			const pluginVersionPlatform = await api.plugin.version.platform.get({
				pluginUid,
				version,
				platform,
			});

			should(omit(pluginVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'updated-index.js',
				runtime: 'nodejs',
				md5Checksum,
			});
			should(pluginVersionPlatform!.archiveUri).match(new RegExp(`/plugin/${pluginUid}/${version}/${platform}\\.${md5ChecksumHex}\\.zip$`));
		});
	});

	describe('delete', () => {
		it('should delete plugin version platform', async () => {
			await api.plugin.version.platform.delete({ pluginUid, version, platform });

			const pluginVersionPlatform = await api.plugin.version.platform.get({
				pluginUid,
				version,
				platform,
			});
			should(pluginVersionPlatform).be.null();
		});
	});
});
