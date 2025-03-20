import * as should from 'should';
import * as fs from 'fs-extra';
import * as path from 'path';
import { omit } from 'lodash';
import { createApiV1 } from '../../../../../../src';
import { opts } from '../../../helper';
import { CustomScriptVersionPlatform } from '../../../../../../src/RestApi/CustomScript/Version/Platform/CustomScriptVersionPlatform';

const api = createApiV1(opts);

describe('RestAPI - Custom Script Version Platform', () => {
	let customScriptUid: string;
	const version = '1.0.0';
	const platform = 'tizen';
	const md5Checksum = 'e50e3ab7aded00bb7015eb0c47ccf827';
	const md5ChecksumHex = Buffer.from(md5Checksum, 'base64').toString('hex');

	before(async () => {
		const customScript = await api.customScript.create({
			name: 'test-custom-script',
			title: 'Test Custom Script',
			dangerLevel: 'low',
		});

		customScriptUid = customScript.uid;

		await api.customScript.version.create({ customScriptUid, version, configDefinition: [] });
	});

	after(async () => {
		await api.customScript.version.delete({ customScriptUid, version });
		await api.customScript.delete(customScriptUid);
	});

	describe('create', () => {
		it('should create custom script version platform', async () => {
			const filePath = path.join(__dirname, 'test.zip');
			const size = (await fs.stat(filePath)).size;
			const archiveFileStream = fs.createReadStream(filePath);

			await api.customScript.version.platform.archive.upload({
				customScriptUid,
				version,
				platform,
				md5Checksum,
				size,
				stream: archiveFileStream,
			});

			const customScriptVersionPlatform = await api.customScript.version.platform.create({
				customScriptUid,
				version,
				platform,
				mainFile: 'main.js',
				md5Checksum,
				runtime: 'browser',
			});

			should(omit(customScriptVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'main.js',
				md5Checksum,
				runtime: 'browser',
			});
			should(customScriptVersionPlatform.archiveUri).match(
				new RegExp(`/custom-script/${customScriptUid}/${version}/${platform}\.${md5ChecksumHex}\.zip$`),
			);
		});
	});

	describe('list', () => {
		it('should list custom script version platforms', async () => {
			const customScriptVersionPlatforms = await api.customScript.version.platform.list({ customScriptUid, version });

			should(customScriptVersionPlatforms).be.an.Array();
			should(customScriptVersionPlatforms.length).be.greaterThanOrEqual(1);
			should(customScriptVersionPlatforms).matchAny(
				(customScriptVersionPlatform: CustomScriptVersionPlatform) => customScriptVersionPlatform.platform === platform,
			);
		});
	});

	describe('get', () => {
		it('should get custom script version platform', async () => {
			const customScriptVersionPlatform = await api.customScript.version.platform.get({ customScriptUid, version, platform });

			should(omit(customScriptVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'main.js',
				md5Checksum,
				runtime: 'browser',
			});
			should(customScriptVersionPlatform!.archiveUri).match(
				new RegExp(`/custom-script/${customScriptUid}/${version}/${platform}\.${md5ChecksumHex}\.zip$`),
			);
		});

		it('should return null for non-existing custom script version platform', async () => {
			const customScriptVersionPlatform = await api.customScript.version.platform.get({
				customScriptUid,
				version,
				platform: 'webos',
			});
			should(customScriptVersionPlatform).be.null();
		});
	});

	describe('update', () => {
		it('should update custom script version platform', async () => {
			await api.customScript.version.platform.update({
				customScriptUid,
				version,
				platform,
				mainFile: 'new.js',
				md5Checksum,
				runtime: 'browser',
			});

			const customScriptVersionPlatform = await api.customScript.version.platform.get({ customScriptUid, version, platform });

			should(omit(customScriptVersionPlatform, 'archiveUri')).deepEqual({
				platform,
				mainFile: 'new.js',
				runtime: 'browser',
				md5Checksum,
			});
			should(customScriptVersionPlatform!.archiveUri).match(
				new RegExp(`/custom-script/${customScriptUid}/${version}/${platform}\.${md5ChecksumHex}\.zip$`),
			);
		});
	});

	describe('delete', () => {
		it('should delete custom script version platform', async () => {
			await api.customScript.version.platform.delete({ customScriptUid, version, platform });
			const customScriptVersionPlatform = await api.customScript.version.platform.get({ customScriptUid, version, platform });
			should(customScriptVersionPlatform).be.null();
		});
	});
});
