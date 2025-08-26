import should from 'should';
import { createApiV1 } from '../../../../../../src';
import { PluginVersionPlatform } from '../../../../../../src/RestApi/Plugin/Version/Platform/PluginVersionPlatform';
import { opts } from '../../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Plugin Version Platform', () => {
	let pluginUid: string;
	const version = '1.0.0';
	const platform = 'tizen';

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
		await api.plugin.delete(pluginUid);
	});

	describe('create', () => {
		it('should create plugin version platform', async () => {
			const pluginVersionPlatform = await api.plugin.version.platform.create({
				pluginUid,
				version,
				platform,
				mainFile: 'index.js',
				runtime: 'browser.js',
				md5Checksum: 'abc123def456',
			});

			should(pluginVersionPlatform.pluginUid).be.equal(pluginUid);
			should(pluginVersionPlatform.version).be.equal(version);
			should(pluginVersionPlatform.platform).be.equal(platform);
			should(pluginVersionPlatform.mainFile).be.equal('index.js');
			should(pluginVersionPlatform.runtime).be.equal('browser.js');
			should(pluginVersionPlatform.md5Checksum).be.equal('abc123def456');
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
			should(pluginVersionPlatform!.pluginUid).be.equal(pluginUid);
			should(pluginVersionPlatform!.version).be.equal(version);
			should(pluginVersionPlatform!.platform).be.equal(platform);
		});

		it('should return null for non-existing plugin version platform', async () => {
			const pluginVersionPlatform = await api.plugin.version.platform.get({
				pluginUid,
				version,
				platform: 'non-existing',
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
				runtime: 'node.js',
				md5Checksum: 'updated123hash456',
			});

			const pluginVersionPlatform = await api.plugin.version.platform.get({
				pluginUid,
				version,
				platform,
			});

			should(pluginVersionPlatform!.mainFile).be.equal('updated-index.js');
			should(pluginVersionPlatform!.runtime).be.equal('node.js');
			should(pluginVersionPlatform!.md5Checksum).be.equal('updated123hash456');
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
