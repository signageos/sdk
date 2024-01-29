import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, successRes } from '../../helper';
import IDeviceDebug, { IDeviceDebugUpdatable } from '../../../../../src/RestApi/Device/Debug/IDeviceDebug';
import DeviceDebugManagement from '../../../../../src/RestApi/Device/Debug/DeviceDebugManagement';

const nockOpts = getNockOpts({});

describe('DeviceDebugManagement', () => {
	const dbg: IDeviceDebug = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		appletEnabled: true,
		nativeEnabled: false,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	};
	const validGetResp: IDeviceDebug[] = [dbg];
	const validSetReq: IDeviceDebugUpdatable = {
		appletEnabled: false,
		nativeEnabled: true,
	};

	const ddm = new DeviceDebugManagement(nockOpts);

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/device/someUid/debug')
		.reply(200, validGetResp)
		.put('/v1/device/someUid/debug', validSetReq)
		.reply(200, successRes);

	describe('get debug settings', () => {
		it('should parse the response', async () => {
			const debug = await ddm.list('someUid');
			should.equal(1, debug.length);
			should.equal('someUid', debug[0].uid);
			should(debug[0].appletEnabled).true();
			should(debug[0].nativeEnabled).false();
		});
	});

	describe('set debug settings', () => {
		it('should set debug options correctly', async () => {
			await ddm.set('someUid', validSetReq);
			should(true).true();
		});
	});
});
