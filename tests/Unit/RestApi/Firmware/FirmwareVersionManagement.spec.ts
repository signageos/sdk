import * as should from 'should';
import * as nock from 'nock';
import { nockOpts, successRes } from '../helper';
import IFirmwareVersion, {
	IFirmwareVersionCreatable,
	IFirmwareVersionUpdatable,
} from '../../../../src/RestApi/Firmware/Version/IFirmwareVersion';
import FirmwareVersionManagement from "../../../../src/RestApi/Firmware/Version/FirmwareVersionManagement";

describe('FirmwareVersionManagement', () => {

	const firmwareVersion: IFirmwareVersion = {
		'uid': 'someUid',
		'applicationType': 'webos',
		'version': '04.01.74',
		'createdAt': new Date('2017-05-24T08:56:52.550Z'),
		'hash': '8e9c3ded774d7b021be452570e0aba10',
		'confirmed': false,
	};

	const validGetResp: IFirmwareVersion = firmwareVersion;
	const validListResp: IFirmwareVersion[] = [firmwareVersion];
	const validCreateReq: IFirmwareVersionCreatable = {
		"applicationType": "webos",
		"version": "04.01.74",
		"hash": "8e9c3ded774d7b021be452570e0aba10",
	};
	const validUpdateReqBody: IFirmwareVersionUpdatable = {
		"confirmed": true,
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/firmware/version').reply(200, validListResp)
		.post('/v1/firmware/version', validCreateReq).reply(200, 'Created')
		.put('/v1/firmware/version/webos/04.01.74', validUpdateReqBody).reply(204, successRes);

	const fm = new FirmwareVersionManagement(nockOpts);
	const assertFwv = (fwv: IFirmwareVersion) => {
		should.equal(validGetResp.uid, fwv.uid);
		should.equal(validGetResp.applicationType, fwv.applicationType);
		should.equal(validGetResp.version, fwv.version);
		should.deepEqual(validGetResp.createdAt, fwv.createdAt);
		should.equal(validGetResp.hash, fwv.hash);
		should.equal(validGetResp.confirmed, fwv.confirmed);
	};

	it('should get the organization list', async () => {
		const fwvs = await fm.list();
		should.equal(1, fwvs.length);
		assertFwv(fwvs[0]);
	});

	it('should create new firmware for upload', async () => {
		await fm.create(validCreateReq);
		should(true).true();
	});

	it('should set confirmed true after firmware upload', async () => {
		await fm.set('webos', '04.01.74', validUpdateReqBody);
		should(true).true();
	});

});
