import * as should from 'should';
import * as nock from "nock";
import { nockOpts, successRes } from "../../helper";
import IAppletVersion, {
	IAppletVersionCreatable,
	IAppletVersionUpdatable,
} from "../../../../../src/RestApi/Applet/Version/IAppletVersion";
import AppletVersionManagement from "../../../../../src/RestApi/Applet/Version/AppletVersionManagement";

describe('AppletVersionManagement', () => {

	const validGetResp: IAppletVersion = {
		appletUid: "appletUid",
		version: "1.1.0",
		createdAt: new Date("2018-05-10T09:07:53.375Z"),
		updatedAt: new Date("2018-05-10T09:09:47.466Z"),
		binary: "some binary data",
		frontAppletVersion: "1.1.1",
		publishedSince: null,
		deprecatedSince: null,
		builtSince: new Date("2018-05-10T09:09:51.651Z"),

	};
	const validListResp: IAppletVersion[] = [validGetResp];
	const validCreateClientReq: IAppletVersionCreatable = {
		version: "1.1.0",
		frontAppletVersion: "1.1.1",
		binary: "some binary data",
	};
	const validCreateReqBody = "some binary data";
	const validUpdateReq: IAppletVersionUpdatable = {
		frontAppletVersion: "1.1.1",
		binary: "some updated binary data",
	};
	const validUpdateReqBody = "some updated binary data";

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/applet/appletUid/version/').reply(200, validListResp)
		.post('/v1/applet/appletUid/version/?frontAppletVersion=1.1.1&version=1.1.0', validCreateReqBody).reply(200, successRes)
		.get('/v1/applet/appletUid/version/1.1.0/').reply(200, validGetResp)
		.put('/v1/applet/appletUid/version/1.1.0/?frontAppletVersion=1.1.1', validUpdateReqBody).reply(200, successRes);

	const avm = new AppletVersionManagement(nockOpts);

	it('should parse the get response', async () => {
		const ver = await avm.get('appletUid', '1.1.0');
		should.equal('appletUid', ver.appletUid);
		should.equal('some binary data', ver.binary);
		should.equal('1.1.1', ver.frontAppletVersion);
	});

	it('should parse list response', async () => {
		const vers = await avm.list('appletUid');
		should(vers).lengthOf(1);
		should.equal('appletUid', vers[0].appletUid);
		should.equal('some binary data', vers[0].binary);
		should.equal('1.1.1', vers[0].frontAppletVersion);
	});

	it('should create new applet version', async () => {
		await avm.create('appletUid', validCreateClientReq);
		should(true).true();
	});

	it('should update existing applet version', async () => {
		await avm.update('appletUid', '1.1.0', validUpdateReq);
		should(true).true();
	});

});
