import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, successRes } from '../helper';
import IFirmwareVersion, {
	IFirmwareVersionUpdatable,
	IFirmwareVersionCreatable,
} from '../../../../src/RestApi/Firmware/Version/IFirmwareVersion';
import FirmwareVersionManagement from '../../../../src/RestApi/Firmware/Version/FirmwareVersionManagement';
import { createReadableStream } from '../Applet/Version/File/helper';

const nockOpts = getNockOpts({});

describe('FirmwareVersionManagement', () => {
	const firmwareVersion: IFirmwareVersion = {
		'uid': 'someUid',
		'applicationType': 'webos',
		'version': '04.01.74',
		'createdAt': new Date('2017-05-24T08:56:52.550Z'),
		'uploaded': false,
		'files': [],
	};

	const validGetResp: IFirmwareVersion = firmwareVersion;
	const validListResp: IFirmwareVersion[] = [firmwareVersion];
	const validCreateReq = {
		"applicationType": "webos",
		"version": "04.01.74",
		'hashes': ['8e9c3ded774d7b021be452570e0aba10', '8e9c3ded774d7b021be452570e0aba11'],
	};
	const validUpdateReqBody: IFirmwareVersionUpdatable = {
		"uploaded": true,
	};

	const successCreateRes = [
		{
			upload: {
				request: {
					url: 'http://myNiceStorage/create',
					fields: {
						'Key': 'test/file/path/testFileName',
						'Content-Type': 'valid/type',
						'Content-MD5': '8e9c3ded774d7b021be452570e0aba10',
					},
				},
			},
			file: {
				url: 'final uploaded test file url',
			},
		},
		{
			upload: {
				request: {
					url: 'http://myNiceStorage/create',
					fields: {
						'Key': 'test/file/path/testFileName',
						'Content-Type': 'valid/type',
						'Content-MD5': '8e9c3ded774d7b021be452570e0aba11',
					},
				},
			},
			file: {
				url: 'final uploaded test file url N2',
			},
		},
];

	beforeEach(function() {
		nock(
			nockOpts.url, {
				reqheaders: {
					'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
				},
			})
			.get('/v1/firmware/version').reply(200, validListResp)
			.put('/v1/firmware/version/webos/04.01.74', validUpdateReqBody).reply( 200, successRes )
			.post('/v1/firmware/version', validCreateReq).reply(200, successCreateRes)
			.put('/v1/firmware/version/linux/1.3.0/rpi4', validUpdateReqBody).reply( 200, successRes )
			.put('/v1/firmware/version/linux/1.3.0/rpi5?force=true', validUpdateReqBody).reply( 200, successRes );

		nock('http://myNiceStorage')
		.post('/create').reply(204)
		.post('/update').reply(204);
	});

	const fm = new FirmwareVersionManagement(nockOpts);
	const assertFwv = (fwv: IFirmwareVersion) => {
		should.equal(validGetResp.uid, fwv.uid);
		should.equal(validGetResp.applicationType, fwv.applicationType);
		should.equal(validGetResp.version, fwv.version);
		should.deepEqual(validGetResp.createdAt, fwv.createdAt);
		should.equal(validGetResp.uploaded, fwv.uploaded);
	};

	it('should get the organization list', async () => {
		const fwvs = await fm.list();
		should.equal(1, fwvs.length);
		assertFwv(fwvs[0]);
	});

	it('should create new firmware for upload', async () => {

		const validCreateClientReq: IFirmwareVersionCreatable = {
			applicationType: 'webos',
			version: '04.01.74',
			files: [
				{
					hash: '8e9c3ded774d7b021be452570e0aba10',
					content: createReadableStream('this is create file req content'),
					size: 12345,
				},
				{
					hash: '8e9c3ded774d7b021be452570e0aba11',
					content: createReadableStream('this is create file req content asdf'),
					size: 12345,
				},
		],
		};
		await fm.create( validCreateClientReq );
		should(true).true();
	});

	it('should set confirmed true after firmware upload', async () => {
		const validClientUpdateReq: IFirmwareVersionUpdatable = {
			uploaded: true,
		};
		await fm.set('webos', '04.01.74', undefined, validClientUpdateReq);
		should(true).true();
	});

	it('should set confirmed true after firmware upload with type', async () => {
		const validClientUpdateReq: IFirmwareVersionUpdatable = {
			uploaded: true,
		};
		await fm.set('linux', '1.3.0', 'rpi4', validClientUpdateReq);
		should(true).true();
	});

	it('should set confirmed true after firmware upload with type and force', async () => {
		const validClientUpdateReq: IFirmwareVersionUpdatable = {
			uploaded: true,
		};
		await fm.set('linux', '1.3.0', 'rpi5', validClientUpdateReq, true);
		should(true).true();
	});

});
