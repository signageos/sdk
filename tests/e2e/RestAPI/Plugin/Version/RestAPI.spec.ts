import should from 'should';
import { createApiV1 } from '../../../../../src';
import { PluginVersion } from '../../../../../src/RestApi/Plugin/Version/PluginVersion';
import { opts } from '../../helper';

const api = createApiV1(opts);

describe('e2e.RestAPI - Plugin Version', () => {
	let pluginUid: string;
	const version = '1.0.0';

	before(async () => {
		const plugin = await api.plugin.create({
			name: 'test-plugin',
			title: 'Test Plugin',
			description: 'Test plugin description',
		});

		pluginUid = plugin.uid;
	});

	after(async () => {
		await api.plugin.delete(pluginUid);
	});

	describe('create', () => {
		it('should create plugin version', async () => {
			const configDefinition = [
				{
					name: 'brightness',
					type: 'number',
					default: 50,
					min: 0,
					max: 100,
					description: 'Screen brightness level',
				},
				{
					name: 'debug',
					type: 'boolean',
					default: false,
					description: 'Enable debug mode',
				},
			];

			const pluginVersion = await api.plugin.version.create({
				pluginUid,
				version,
				configDefinition,
			});

			should(pluginVersion.pluginUid).be.equal(pluginUid);
			should(pluginVersion.version).be.equal(version);
			should(pluginVersion.configDefinition).deepEqual(configDefinition);
		});
	});

	describe('list', () => {
		it('should list plugin versions', async () => {
			const pluginVersions = await api.plugin.version.list(pluginUid);

			should(pluginVersions).be.an.Array();
			should(pluginVersions.length).be.greaterThanOrEqual(1);
			should(pluginVersions).matchAny((pluginVersion: PluginVersion) => pluginVersion.pluginUid === pluginUid);
		});
	});

	describe('get', () => {
		it('should get plugin version', async () => {
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
			const updatedConfigDefinition = [
				{
					name: 'volume',
					type: 'number',
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
			should(pluginVersion!.configDefinition).deepEqual(updatedConfigDefinition);
		});
	});

	describe('delete', () => {
		it('should delete plugin version', async () => {
			await api.plugin.version.delete({ pluginUid, version });

			const pluginVersion = await api.plugin.version.get({ pluginUid, version });
			should(pluginVersion).be.null();
		});
	});
});
