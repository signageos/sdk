import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import AppletCommandManagement from "../../../../../src/RestApi/Applet/Command/AppletCommandManagement";
import IAppletCommand, {IAppletCommandSendable} from "../../../../../src/RestApi/Applet/Command/IAppletCommand";

describe('AppletCommandManagement', () => {

	const cmd: IAppletCommand = {
		commandPayload: {
			type: 'Applet.Command',
			payload: {
				level: 'OK',
				message: 'APPLET INIT',
			},
		},
		uid: 'someUid',
		appletUid: 'appletUid',
		deviceUid: 'deviceUid',
		receivedAt: new Date('2018-05-10T09:07:53.375Z'),
		timingChecksum: 'c8f69XX5740',
	};
	const cmdResp: IAppletCommand[] = [cmd];
	const sendCmd: IAppletCommandSendable = {
		commandPayload: {
			type: 'Applet.Command',
			payload: {
				level: 'OK',
				message: 'APPLET INIT',
			},
		},
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/applet/anotherUid/command').reply(200, cmdResp)
		.post('/v1/device/someUid/applet/anotherUid/command', sendCmd).reply(200, 'Accepted');

	const acm = new AppletCommandManagement(nockOpts);

	it('should list all commands', async () => {
		const c = await acm.commands('someUid', 'anotherUid');
		should.equal(1, c.length);
		should.equal(cmd.uid, c[0].uid);
		should.equal(cmd.deviceUid, c[0].deviceUid);
		should.equal(cmd.appletUid, c[0].appletUid);
		should.deepEqual(cmd.receivedAt, c[0].receivedAt);
		should.deepEqual(cmd.timingChecksum, c[0].timingChecksum);
		should.deepEqual(cmd.commandPayload, c[0].commandPayload);
	});

	it('should send new applet command', async () => {
		await acm.send('someUid', 'anotherUid', sendCmd);
		should(true).true();
	});

});
