import * as should from 'should';
import * as nock from "nock";
import { nockOpts, successRes } from "../../helper";
import IAppletTestSuite, {
	IAppletTestSuiteCreatable,
	IAppletTestSuiteUpdatable
} from "../../../../../src/RestApi/Applet/Version/IAppletTestSuite";
import AppletTestSuiteManagement from "../../../../../src/RestApi/Applet/Version/AppletTestSuiteManagement";

describe('AppletTestSuiteManagement', () => {

	const validGetResp: IAppletTestSuite = {
		appletUid: "appletUid",
		appletVersion: "1.0.1",
		binary: "some binary data",
		identifier: "testName"
	};
	const validListResp: IAppletTestSuite[] = [validGetResp];
	const validCreateReq: IAppletTestSuiteCreatable = {
		binary: "some binary data",
	};
	const validUpdateReq: IAppletTestSuiteUpdatable = {
		binary: "some binary data",
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/applet/appletUid/version/1.0.1/test').reply(200, validListResp)
		.post('/v1/applet/appletUid/version/1.0.1/test/testName', validCreateReq).reply(200, successRes)
		.get('/v1/applet/appletUid/version/1.0.1/test/testName').reply(200, validGetResp)
		.put('/v1/applet/appletUid/version/1.0.1/test/testName').reply(200, successRes);

	const atsm = new AppletTestSuiteManagement(nockOpts);

	it('should parse the get response', async () => {
		const tc = await atsm.get('appletUid', '1.0.1', 'testName');
		should.equal(validGetResp.appletUid, tc.appletUid);
		should.equal(validGetResp.appletVersion, tc.appletVersion);
		should.equal(validGetResp.identifier, tc.identifier);
		should.equal(validGetResp.binary, tc.binary);
	});

	it('should parse list response', async () => {
		const tcs = await atsm.list('appletUid', '1.0.1');
		should(tcs).lengthOf(1);
		should.equal(validGetResp.appletUid, tcs[0].appletUid);
		should.equal(validGetResp.appletVersion, tcs[0].appletVersion);
		should.equal(validGetResp.identifier, tcs[0].identifier);
		should.equal(validGetResp.binary, tcs[0].binary);
	});

	it('should create new applet test suite', async () => {
		await atsm.create('appletUid', '1.0.1', 'testName', validCreateReq);
		should(true).true();
	});

	it('should update existing applet test suite', async () => {
		await atsm.update('appletUid', '1.0.1', 'testName', validUpdateReq);
		should(true).true();
	});

});
