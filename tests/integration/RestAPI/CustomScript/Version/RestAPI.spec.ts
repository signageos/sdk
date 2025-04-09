import should from 'should';
import { createApiV1 } from '../../../../../src';
import { CustomScriptVersion } from '../../../../../src/RestApi/CustomScript/Version/CustomScriptVersion';
import { opts } from '../../helper';

const api = createApiV1(opts);

describe('RestAPI - Custom Script Version', () => {
	let customScriptUid: string;
	const version = '1.0.0';

	before(async () => {
		const customScript = await api.customScript.create({
			name: 'test-custom-script',
			title: 'Test Custom Script',
			dangerLevel: 'low',
		});

		customScriptUid = customScript.uid;
	});

	after(async () => {
		await api.customScript.delete(customScriptUid);
	});

	describe('create', () => {
		it('should create custom script version', async () => {
			const configDefinition = [
				{
					name: 'brightness',
					valueType: 'number',
					mandatory: true,
					description: 'The brightness level to set',
				},
			];

			const customScriptVersion = await api.customScript.version.create({ customScriptUid, version, configDefinition });

			should(customScriptVersion.customScriptUid).be.equal(customScriptUid);
			should(customScriptVersion.version).be.equal(version);
			should(customScriptVersion.configDefinition).deepEqual(configDefinition);
		});
	});

	describe('list', () => {
		it('should list custom script versions', async () => {
			const customScriptVersions = await api.customScript.version.list(customScriptUid);

			should(customScriptVersions).be.an.Array();
			should(customScriptVersions.length).be.greaterThanOrEqual(1);
			should(customScriptVersions).matchAny(
				(customScriptVersion: CustomScriptVersion) => customScriptVersion.customScriptUid === customScriptUid,
			);
		});
	});

	describe('get', () => {
		it('should get custom script version', async () => {
			const customScriptVersion = await api.customScript.version.get({ customScriptUid, version });

			should(customScriptVersion).be.an.instanceOf(CustomScriptVersion);
			should(customScriptVersion!.customScriptUid).be.equal(customScriptUid);
			should(customScriptVersion!.version).be.equal(version);
		});

		it('should return null when custom script version does not exist', async () => {
			const customScriptVersion = await api.customScript.version.get({ customScriptUid, version: '0.0.0' });
			should(customScriptVersion).be.null();
		});
	});

	describe('update', () => {
		it('should update custom script version', async () => {
			const configDefinition = [
				{
					name: 'brightness',
					valueType: 'number',
					mandatory: true,
					description: 'The brightness level to set',
				},
				{
					name: 'color',
					valueType: 'string',
					mandatory: true,
					description: 'The color to set',
				},
			];

			await api.customScript.version.update({ customScriptUid, version, configDefinition });

			const customScriptVersion = await api.customScript.version.get({ customScriptUid, version });

			should(customScriptVersion).be.an.instanceOf(CustomScriptVersion);
			should(customScriptVersion!.customScriptUid).be.equal(customScriptUid);
			should(customScriptVersion!.version).be.equal(version);
			should(customScriptVersion!.configDefinition).deepEqual(configDefinition);
		});
	});

	describe('delete', () => {
		it('should delete custom script version', async () => {
			await api.customScript.version.delete({ customScriptUid, version });

			const customScriptVersion = await api.customScript.version.get({ customScriptUid, version });
			should(customScriptVersion).be.null();
		});
	});
});
