import should from 'should';

import { Api } from '../../../../src';
import { opts } from '../helper';
import IFirmwareVersion from '../../../../src/RestApi/Firmware/Version/IFirmwareVersion';
import FirmwareVersion from '../../../../src/RestApi/Firmware/Version/FirmwareVersion';
import { createReadableStream } from '../../../unit/RestApi/Applet/Version/File/helper';

const api = new Api(opts);

describe('e2e.RestAPI - FirmwareVersion', () => {
	const randomString = Math.random().toString(36).substring(7);
	const firmwareVersion = `04.01.74-${randomString}`;

	const assertFwv = (fwv: IFirmwareVersion) => {
		should(fwv instanceof FirmwareVersion).true();
		should(fwv.uid).String();
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
	});

	it('should create the new firmwareVersion', async () => {
		await api.firmwareVersion.create({
			applicationType: `webos`,
			version: firmwareVersion,
			files: [
				{
					content: createReadableStream('i am very beautiful stream of bytes'),
					hash: `8e9c3ded774d7b021be452570e0aba10`,
					size: 35,
				},
			],
		});
		should(true).true();
	});
});
