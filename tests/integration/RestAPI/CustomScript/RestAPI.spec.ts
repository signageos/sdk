import should from 'should';
import { createApiV1 } from '../../../../src';
import { opts } from '../helper';
import { CustomScript } from '../../../../src/RestApi/CustomScript/CustomScript';

const api = createApiV1(opts);

describe('RestAPI - Custom Script', () => {
	let customScriptUid: string;

	describe('create', () => {
		it('should create custom script', async () => {
			const customScript = await api.customScript.create({
				name: 'test-custom-script',
				title: 'Test Custom Script',
				dangerLevel: 'low',
			});

			should(customScript.uid).be.not.empty();
			should(customScript.name).be.equal('test-custom-script');
			should(customScript.title).be.equal('Test Custom Script');
			should(customScript.dangerLevel).be.equal('low');

			customScriptUid = customScript.uid;
		});
	});

	describe('list', () => {
		it('should list custom scripts', async () => {
			const customScripts = await api.customScript.list();

			should(customScripts).be.an.Array();
			should(customScripts.length).be.greaterThanOrEqual(1);
			should(customScripts).matchAny((customScript: CustomScript) => customScript.uid === customScriptUid);
		});
	});

	describe('get', () => {
		it('should get custom script', async () => {
			const customScript = await api.customScript.get(customScriptUid);

			should(customScript).be.an.instanceOf(CustomScript);
			should(customScript!.uid).be.equal(customScriptUid);
			should(customScript!.name).be.equal('test-custom-script');
			should(customScript!.title).be.equal('Test Custom Script');
			should(customScript!.dangerLevel).be.equal('low');
		});

		it('should return null for non-existing custom script', async () => {
			const customScript = await api.customScript.get('non-existing-custom-script');
			should(customScript).be.null();
		});
	});

	describe('update', () => {
		it('should update custom script', async () => {
			await api.customScript.update(customScriptUid, {
				title: 'Test Custom Script Updated',
			});

			const customScript = await api.customScript.get(customScriptUid);

			should(customScript).be.an.instanceOf(CustomScript);
			should(customScript!.uid).be.equal(customScriptUid);
			should(customScript!.name).be.equal('test-custom-script');
			should(customScript!.title).be.equal('Test Custom Script Updated');
			should(customScript!.dangerLevel).be.equal('low');
		});
	});

	describe('delete', () => {
		it('should delete custom script', async () => {
			await api.customScript.delete(customScriptUid);
			const customScript = await api.customScript.get(customScriptUid);
			should(customScript).be.null();
		});
	});
});
