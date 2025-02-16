import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts } from '../../helper';
import AppletCommandManagement from '../../../../../src/RestApi/Applet/Command/AppletCommandManagement';
import IAppletCommand, { IAppletCommandSendable } from '../../../../../src/RestApi/Applet/Command/IAppletCommand';

const nockOpts = getNockOpts({});

describe('AppletCommandManagement', () => {
	const cmd: IAppletCommand = {
		command: {
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
	const sendCmd: IAppletCommandSendable<any> = {
		command: {
			type: 'Applet.Command',
			payload: {
				level: 'OK',
				message: 'APPLET INIT',
			},
		},
	};
	const responseLocation = `${nockOpts.url}/v1/device/someUid/applet/appletUid/command/cmdUid`;

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/device/someUid/applet/appletUid/command')
		.reply(200, cmdResp)
		.get('/v1/device/someUid/applet/appletUid/command/cmdUid')
		.reply(200, cmd)
		.post('/v1/device/someUid/applet/appletUid/command', sendCmd as {})
		.reply(202, 'Accepted', { location: responseLocation })
		.get('/v1/device/someUid/applet/appletUid/command/cmdUid')
		.reply(200, cmd);

	const acm = new AppletCommandManagement(nockOpts);

	const assertCmd = (c: IAppletCommand) => {
		should.equal(cmd.uid, c.uid);
		should.equal(cmd.deviceUid, c.deviceUid);
		should.equal(cmd.appletUid, c.appletUid);
		should.deepEqual(cmd.receivedAt, c.receivedAt);
		should.deepEqual(cmd.timingChecksum, c.timingChecksum);
		should.deepEqual(cmd.command, c.command);
	};

	it('should list all list', async () => {
		const c = await acm.list('someUid', 'appletUid');
		should.equal(1, c.length);
		assertCmd(c[0]);
	});

	it('should get single command', async () => {
		const c = await acm.get('someUid', 'appletUid', 'cmdUid');
		assertCmd(c);
	});

	it('should send new applet command', async () => {
		const response = await acm.send('someUid', 'appletUid', sendCmd);
		should(response.uid).equal(cmd.uid);
		should(response.deviceUid).equal(cmd.deviceUid);
		should(response.appletUid).equal(cmd.appletUid);
		should(response.timingChecksum).equal(cmd.timingChecksum);
	});
});
