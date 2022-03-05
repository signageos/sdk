import * as should from 'should';

import { Api } from "../../../../src";
import { opts, ALLOWED_TIMEOUT, preRunCheck } from "../helper";
import IFirmwareVersion, { IFirmwareVersionUpdatable } from '../../../../src/RestApi/Firmware/Version/IFirmwareVersion';
import FirmwareVersion from '../../../../src/RestApi/Firmware/Version/FirmwareVersion';
import { createReadableStream } from '../../../Unit/RestApi/Applet/Version/File/helper';

const api = new Api(opts);

describe('RestAPI - FirmwareVersion', () => {

	const firmwareVersion: IFirmwareVersion = {
		'uid': 'someUid',
		'applicationType': 'webos',
		'version': '04.01.74',
		'createdAt': new Date('2017-05-24T08:56:52.550Z'),
		'uploaded': false,
		'files': [
			{
				'content': createReadableStream(''),
				'hash': '8e9c3ded774d7b021be452570e0aba10',
				'size': 12345,
			},
		],
	};

	before (function() {
		preRunCheck(this.skip.bind(this));
	});

	const assertFwv = (fwv: IFirmwareVersion) => {
		should(fwv instanceof FirmwareVersion).true();
		should(fwv.uid).lengthOf(50, 'firmwareVersion uid should consist of 50 characters');
		should(fwv.applicationType.length).aboveOrEqual(0, 'firmwareVersion applicationType should never be empty');
		should(fwv.version.length).aboveOrEqual(0, 'firmwareVersion version should never be empty');
		should(fwv.createdAt.getTime()).aboveOrEqual(0, 'firmwareVersion createdAt should be real date');
	};

	it('should get the list of existing firmwareVersions', async () => {

		const fwvs = await api.firmwareVersion.list();
		should(Array.isArray(fwvs)).true();
		fwvs.forEach((fwv: IFirmwareVersion) => {
			assertFwv(fwv);
		});

	}).timeout(ALLOWED_TIMEOUT);

	it('should create the new firmwareVersion', async () => {

		await api.firmwareVersion.create({
			applicationType: `webos`,
			version: `04.01.74`,
			files: [
				{
					content: createReadableStream('i am very beautiful stream of bytes'),
					hash: `8e9c3ded774d7b021be452570e0aba10`,
					size: 12345,
				},
			],
		});
		should(true).true();

	}).timeout(ALLOWED_TIMEOUT);

	it('should set firmwareVersion uploaded', async function () {

		const update: IFirmwareVersionUpdatable = { uploaded: true };
		await api.firmwareVersion.set('webos', '04.01.74', undefined, update);
		const firmwareVersions = await api.firmwareVersion.list();
		firmwareVersions.forEach((fwv: IFirmwareVersion) => {
			if (fwv.uid === firmwareVersion.uid) {
				should.equal(fwv.uploaded, update.uploaded);
			}
		});

	});

});
