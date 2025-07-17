import should from 'should';
import { createApiV1 } from '../../../../src';
import { opts } from '../helper';
import { Plugin } from '../../../../src/RestApi/Plugin/Plugin';

const api = createApiV1(opts);

describe('e2e.RestAPI - Plugin', () => {
	let pluginUid: string;

	describe('create', () => {
		it('should create plugin', async () => {
			const plugin = await api.plugin.create({
				name: 'test-plugin',
				title: 'Test Plugin',
				description: 'Test plugin description',
			});

			should(plugin.uid).be.not.empty();
			should(plugin.name).be.equal('test-plugin');
			should(plugin.title).be.equal('Test Plugin');
			should(plugin.description).be.equal('Test plugin description');
			should(plugin.organizationUid).be.not.empty();

			pluginUid = plugin.uid;
		});
	});	describe('list', () => {
		it('should list plugins', async () => {
			const plugins = await api.plugin.list();

			should(plugins).be.an.Array();
			should(plugins.length).be.greaterThanOrEqual(1);
			should(plugins).matchAny((plugin: Plugin) => plugin.uid === pluginUid);
		});
	});

	describe('get', () => {
		it('should get plugin', async () => {
			const plugin = await api.plugin.get(pluginUid);

			should(plugin).be.an.instanceOf(Plugin);
			should(plugin!.uid).be.equal(pluginUid);
			should(plugin!.name).be.equal('test-plugin');
			should(plugin!.title).be.equal('Test Plugin');
			should(plugin!.description).be.equal('Test plugin description');
		});

		it('should return null for non-existing plugin', async () => {
			const plugin = await api.plugin.get('non-existing-plugin');
			should(plugin).be.null();
		});
	});

	describe('update', () => {
		it('should update plugin', async () => {
			await api.plugin.update(pluginUid, {
				name: 'updated-test-plugin',
				description: 'Updated description',
			});

			const plugin = await api.plugin.get(pluginUid);
			should(plugin!.name).be.equal('updated-test-plugin');
			should(plugin!.description).be.equal('Updated description');
		});
	});

	after(async () => {
		await api.plugin.delete(pluginUid);
	});
});
