import * as should from 'should';
import RestApi from "../../../../src/RestApi/RestApi";
import { accountOpts, opts, RUN_INTEGRATION_TESTS } from "../helper";
import IFirmwareVersion, { IFirmwareVersionUpdatable } from '../../../../src/RestApi/Firmware/Version/IFirmwareVersion';
import FirmwareVersion from '../../../../src/RestApi/Firmware/Version/FirmwareVersion';

const allowedTimeout = 10000;
const api = new RestApi(opts, accountOpts);

describe('RestAPI - FirmwareVersion', () => {

	const firmwareVersion: IFirmwareVersion = {
		'uid': 'someUid',
		'applicationType': 'webos',
		'version': '04.01.74',
		'createdAt': new Date('2017-05-24T08:56:52.550Z'),
		'hash': '8e9c3ded774d7b021be452570e0aba10',
		'confirmed': false // TODO: ask misak
	};

	before (function() {
		if (!RUN_INTEGRATION_TESTS || accountOpts.auth.clientId === '' || accountOpts.auth.secret === '') {
			this.test.skip('you must set account auth details in order to run this test');
		}
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

	}).timeout(allowedTimeout);

	it('should create the new firmwareVersion', async () => {

		await api.firmwareVersion.create({
			applicationType: `webos`,
			version: `04.01.74`,
			hash: `8e9c3ded774d7b021be452570e0aba10`
		});
		should(true).true();

	}).timeout(allowedTimeout);

	it('should set firmwareVersion confirmed', async function () {

		const update: IFirmwareVersionUpdatable = { confirmed: true };
		await api.firmwareVersion.set('webos', '04.01.74', update);
		const firmwareVersions = await api.firmwareVersion.list();
		firmwareVersions.forEach((fwv: IFirmwareVersion) => {
			if (fwv.uid === firmwareVersion.uid) {
				should.equal(fwv.confirmed, update.confirmed);
			}
		});

	});

});
