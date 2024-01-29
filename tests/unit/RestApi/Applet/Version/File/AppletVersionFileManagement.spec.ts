import * as should from 'should';
import * as nock from 'nock';
import * as streamToString from 'stream-to-string';

import { getNockOpts } from '../../../helper';
import IAppletVersionFile, {
	IAppletVersionFileCreatable,
	IAppletVersionFileUpdatable,
} from '../../../../../../src/RestApi/Applet/Version/File/IAppletVersionFile';
import AppletVersionFileManagement from '../../../../../../src/RestApi/Applet/Version/File/AppletVersionFileManagement';
import { createReadableStream } from './helper';

const nockOpts = getNockOpts({});

describe('AppletVersionFileManagement', function () {
	const validGetRespBody = createReadableStream('this is get req test file content');
	const validGetRespHeaders: nock.HttpHeaders = {
		'Content-Type': 'valid/content',
	};
	const validListResp: IAppletVersionFile[] = [
		{
			name: 'testFileName',
			path: 'test/file/path/testFileName',
		},
	];
	const validCreateReqBody: Pick<IAppletVersionFileCreatable, 'name' | 'path' | 'type'> & { hash: string } = {
		name: 'testFileName',
		path: 'test/file/path/testFileName',
		type: 'valid/type',
		hash: 'hYljADUvYpAd2Q9JHCWkAA==',
	};
	const successCreateRes = {
		upload: {
			request: {
				url: 'http://storage/create',
				fields: {
					Key: 'test/file/path/testFileName',
					'Content-Type': 'valid/type',
					'Content-MD5': 'testMD5',
				},
			},
		},
		file: {
			url: 'final uploaded test file url',
		},
	};
	const validUpdateReqBody: Partial<IAppletVersionFileUpdatable> & { hash: string } = {
		hash: 'My3muxmv1aNG/7bjGztoBw==',
		type: 'valid/type',
	};
	const successUpdateRes = {
		upload: {
			request: {
				url: 'http://storage/update',
				fields: {
					Key: 'test/file/path/testFileName',
					'Content-Type': 'valid/type',
					'Content-MD5': 'testMD5',
				},
			},
		},
		file: {
			url: 'final uploaded test file url',
		},
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/applet/appletUid/version/1.1.0/file/path/testFile')
		.reply(200, validGetRespBody, validGetRespHeaders)
		.get('/v1/applet/appletUid/version/1.1.0/file')
		.reply(200, validListResp)
		.post('/v1/applet/appletUid/version/1.1.0/file', validCreateReqBody)
		.reply(200, successCreateRes)
		.put('/v1/applet/appletUid/version/1.1.0/file/path/testFile', validUpdateReqBody)
		.reply(200, successUpdateRes)
		.delete('/v1/applet/appletUid/version/1.1.0/file/path/testFile')
		.reply(200);

	nock('http://storage').post('/create').reply(204).post('/update').reply(204);

	const avfm = new AppletVersionFileManagement(nockOpts);

	it('should parse the get response', async function () {
		const file = await avfm.get('appletUid', '1.1.0', 'path/testFile');
		should.equal(await streamToString(file.content!), 'this is get req test file content');
		should.equal(file.name, 'testFile');
		should.equal(file.path, 'path/testFile');
		should.equal(file.type, 'valid/content');
	});

	it('should parse list response', async function () {
		const files = await avfm.list('appletUid', '1.1.0');
		should(files).lengthOf(1);
		should.equal(files[0].name, 'testFileName');
		should.equal(files[0].path, 'test/file/path/testFileName');
	});

	it('should create new applet version file', async function () {
		const data = 'this is create file req content';
		const validCreateClientReq: IAppletVersionFileCreatable = {
			name: 'testFileName',
			path: 'test/file/path/testFileName',
			type: 'valid/type',
			hash: 'hYljADUvYpAd2Q9JHCWkAA==',
			content: createReadableStream(data),
			size: data.length,
		};
		await avfm.create('appletUid', '1.1.0', validCreateClientReq);
		should(true).true();
	});

	it('should update existing applet version file', async function () {
		const data = 'this is updated file req content';
		const validUpdateClientReq: IAppletVersionFileUpdatable = {
			hash: 'My3muxmv1aNG/7bjGztoBw==',
			content: createReadableStream(data),
			type: 'valid/type',
			size: data.length,
		};
		await avfm.update('appletUid', '1.1.0', 'path/testFile', validUpdateClientReq);
		should(true).true();
	});

	it('should remove existing applet version file', async function () {
		await avfm.remove('appletUid', '1.1.0', 'path/testFile');
		should(true).true();
	});
});
