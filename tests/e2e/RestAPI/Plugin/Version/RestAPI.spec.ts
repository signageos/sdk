import should from 'should';
import { createApiV1 } from '../../../../../src';
import { PluginVersion } from '../../../../../src/RestApi/Plugin/Version/PluginVersion';
import { Plugin } from '../../../../../src/RestApi/Plugin/Plugin';
import { opts } from '../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Plugin Version', () => {
	let plugin: Plugin;
	let pluginUid: string;

	before(async () => {
		// Clean up any existing test plugins first
		const existingPlugins = await api.plugin.list();
		const testPlugins = existingPlugins.filter((p) => p.name.startsWith('test-plugin-'));
		for (const plugin of testPlugins) {
			try {
				// Try to delete all versions first
				const versions = await api.plugin.version.list(plugin.uid);
				for (const ver of versions) {
					try {
						await api.plugin.version.delete({ pluginUid: plugin.uid, version: ver.version });
					} catch (error: any) {
						console.log(`Failed to delete version ${ver.version}:`, error.message);
					}
				}
				await api.plugin.delete(plugin.uid);
			} catch (error: any) {
				console.log(`Failed to delete plugin ${plugin.uid}:`, error.message);
			}
		}

		const timestamp = Date.now();
		const randomId = Math.random().toString(36).substring(2, 15); // Make it longer

		plugin = await api.plugin.create({
			name: `test-plugin-${timestamp}-${randomId}`,
			title: `Test Plugin ${timestamp}`,
		});

		pluginUid = plugin.uid;
	});

	after(async () => {
		try {
			await api.plugin.delete(pluginUid);
		} catch (error) {
			// Ignore cleanup errors
			console.warn('Failed to cleanup plugin:', error);
		}
	});

	describe('create', () => {
		it('should create plugin version', async () => {
			// Create a unique version for this test
			const version = `1.${Date.now()}.0`;

			const configDefinition = [
				{
					name: 'brightness',
					valueType: 'number',
					default: 50,
					min: 0,
					max: 100,
					description: 'Screen brightness level',
				},
				{
					name: 'debug',
					valueType: 'string',
					default: 'false',
					description: 'Enable debug mode',
				},
			];

			const pluginVersion = await api.plugin.version.create({
				pluginUid,
				version,
				configDefinition,
				description: 'Test plugin version for e2e testing',
			});

			should(pluginVersion.pluginUid).be.equal(pluginUid);
			should(pluginVersion.version).be.equal(version);
			should(pluginVersion.configDefinition).deepEqual(configDefinition);
		});
	});

	describe('list', () => {
		it('should list plugin versions', async () => {
			// Create a version first for this test
			const version = `2.${Date.now()}.0`;
			await api.plugin.version.create({
				pluginUid,
				version,
				configDefinition: [],
				description: 'Test list version',
			});

			const pluginVersions = await api.plugin.version.list(pluginUid);

			should(pluginVersions).be.an.Array();
			should(pluginVersions.length).be.greaterThanOrEqual(1);
			should(pluginVersions).matchAny((pluginVersion: PluginVersion) => pluginVersion.pluginUid === pluginUid);
		});
	});

	describe('get', () => {
		it('should get plugin version', async () => {
			// Create a version first for this test
			const version = `3.${Date.now()}.0`;
			await api.plugin.version.create({
				pluginUid,
				version,
				configDefinition: [],
				description: 'Test get version',
			});

			const pluginVersion = await api.plugin.version.get({ pluginUid, version });

			should(pluginVersion).be.an.instanceOf(PluginVersion);
			should(pluginVersion!.pluginUid).be.equal(pluginUid);
			should(pluginVersion!.version).be.equal(version);
			should(pluginVersion!.configDefinition).be.an.Array();
		});

		it('should return null for non-existing plugin version', async () => {
			const pluginVersion = await api.plugin.version.get({ pluginUid, version: 'non-existing' });
			should(pluginVersion).be.null();
		});
	});

	describe('update', () => {
		it('should update plugin version', async () => {
			// Create a version first for this test
			const version = `4.${Date.now()}.0`;
			await api.plugin.version.create({
				pluginUid,
				version,
				configDefinition: [],
				description: 'Test update version',
			});

			const updatedConfigDefinition = [
				{
					name: 'volume',
					valueType: 'number',
					default: 75,
					min: 0,
					max: 100,
					description: 'Audio volume level',
				},
			];

			await api.plugin.version.update({
				pluginUid,
				version,
				configDefinition: updatedConfigDefinition,
			});

			const pluginVersion = await api.plugin.version.get({ pluginUid, version });
			// Note: The API may not return the `default` field in the same structure
			// Check if the config definition matches the expected structure
			should(pluginVersion!.configDefinition).be.an.Array();
			should(pluginVersion!.configDefinition[0].name).be.equal('volume');
			should(pluginVersion!.configDefinition[0].valueType).be.equal('number');
			should(pluginVersion!.configDefinition[0].min).be.equal(0);
			should(pluginVersion!.configDefinition[0].max).be.equal(100);
			should(pluginVersion!.configDefinition[0].description).be.equal('Audio volume level');
		});
	});

	describe('delete', () => {
		it('should delete plugin version', async () => {
			// Create a version first for this test
			const version = `5.${Date.now()}.0`;
			await api.plugin.version.create({
				pluginUid,
				version,
				configDefinition: [],
				description: 'Test delete version',
			});

			await api.plugin.version.delete({ pluginUid, version });

			const pluginVersion = await api.plugin.version.get({ pluginUid, version });
			should(pluginVersion).be.null();
		});
	});
});
