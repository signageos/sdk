import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../helper";
import IApplet, {IAppletCreatable} from "../../../../src/RestApi/Applet/IApplet";
import AppletManagement from "../../../../src/RestApi/Applet/AppletManagement";

describe('AppletManagement', () => {

	const validGetResp: IApplet = {
		uid: 'someUid',
		name: 'signageOS Sample',
		createdAt: new Date('2018-03-06T09:57:48.183Z'),
	};
	const validListResp: IApplet[] = [validGetResp];
	const validCreateReq: IAppletCreatable = {
		name: "signageOS Sample",
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/applet').reply(200, validListResp)
		.post('/v1/applet', validCreateReq).reply(200, 'OK')
		.get('/v1/applet/someUid/').reply(200, validGetResp)
		.delete('/v1/applet/someUid/').reply(200, 'OK');

	const am = new AppletManagement(nockOpts);

	it('should parse the get response', async () => {
		const applet = await am.get('someUid');
		should.equal('someUid', applet.uid);
		should.equal('signageOS Sample', applet.name);
		should.equal('2018-03-06T09:57:48.183Z', applet.createdAt.toISOString());
	});

	it('should parse list response', async () => {
		const applets = await am.list();
		should(applets).lengthOf(1);
		should.equal('someUid', applets[0].uid);
		should.equal('signageOS Sample', applets[0].name);
		should.equal('2018-03-06T09:57:48.183Z', applets[0].createdAt.toISOString());
	});

	it('should create new applet', async () => {
		await am.create(validCreateReq);
		should(true).true();
	});

	it('should delete existing applet', async () => {
		await am.delete('someUid');
		should(true).true();
	});

});
