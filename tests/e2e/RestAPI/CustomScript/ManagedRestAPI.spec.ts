import should from 'should';
import { createApiV1 } from '../../../../src';
import { opts } from '../helper';
import { CustomScript } from '../../../../src/RestApi/CustomScript/CustomScript';

const api = createApiV1(opts);

// Managed (global) custom scripts are owned by no organization. Reading is available to any organization with the
// scripts entitlement; creating, updating and deleting is restricted to signageOS admin accounts, so the create case
// only passes when the e2e account is an admin.
describe('e2e.RestAPI - Managed Custom Script', () => {
	let customScriptUid: string;

	describe('create', () => {
		it('should create managed custom script', async () => {
			const customScript = await api.customScript.managed.create({
				name: 'test-managed-custom-script',
				title: 'Test Managed Custom Script',
				dangerLevel: 'low',
			});

			// Exercises the location-header parse and the create-then-fetch round trip in
			// CustomScriptManagedManagement.create.
			should(customScript.uid).be.not.empty();
			should(customScript.name).be.equal('test-managed-custom-script');
			should(customScript.title).be.equal('Test Managed Custom Script');
			should(customScript.dangerLevel).be.equal('low');

			customScriptUid = customScript.uid;
		});
	});

	describe('list', () => {
		it('should list managed custom scripts', async () => {
			const customScripts = await api.customScript.managed.list();

			should(customScripts).be.an.Array();
			should(customScripts.length).be.greaterThanOrEqual(1);
			should(customScripts).matchAny((customScript: CustomScript) => customScript.uid === customScriptUid);
		});
	});

	describe('get', () => {
		it('should get managed custom script', async () => {
			const customScript = await api.customScript.managed.get(customScriptUid);

			should(customScript).be.an.instanceOf(CustomScript);
			should(customScript!.uid).be.equal(customScriptUid);
			should(customScript!.name).be.equal('test-managed-custom-script');
			should(customScript!.title).be.equal('Test Managed Custom Script');
			should(customScript!.dangerLevel).be.equal('low');
		});

		it('should return null for non-existing managed custom script', async () => {
			const customScript = await api.customScript.managed.get('non-existing-managed-custom-script');
			should(customScript).be.null();
		});
	});

	describe('update', () => {
		it('should update managed custom script', async () => {
			await api.customScript.managed.update(customScriptUid, {
				title: 'Test Managed Custom Script Updated',
			});

			const customScript = await api.customScript.managed.get(customScriptUid);

			should(customScript).be.an.instanceOf(CustomScript);
			should(customScript!.uid).be.equal(customScriptUid);
			should(customScript!.name).be.equal('test-managed-custom-script');
			should(customScript!.title).be.equal('Test Managed Custom Script Updated');
			should(customScript!.dangerLevel).be.equal('low');
		});
	});

	describe('delete', () => {
		it('should delete managed custom script', async () => {
			await api.customScript.managed.delete(customScriptUid);
			const customScript = await api.customScript.managed.get(customScriptUid);
			should(customScript).be.null();
		});
	});
});
