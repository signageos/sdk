import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, successRes } from '../../helper';
import IDeviceRemoteControl, { IDeviceRemoteControlUpdatable } from '../../../../../src/RestApi/Device/RemoteControl/IDeviceRemoteControl';
import DeviceRemoteControlManagement from '../../../../../src/RestApi/Device/RemoteControl/DeviceRemoteControlManagement';

const nockOpts = getNockOpts({});

describe('DeviceRemoteControlManagement', () => {
	const dcr: IDeviceRemoteControl = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		enabled: false,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	};
	const validGetResp: IDeviceRemoteControl[] = [dcr];
	const validSetReq: IDeviceRemoteControlUpdatable = {
		enabled: false,
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/device/someUid/remote-control')
		.reply(200, validGetResp)
		.put('/v1/device/someUid/remote-control', validSetReq as {})
		.reply(200, successRes);

	const drcm = new DeviceRemoteControlManagement(nockOpts);

	it('should get the remote control information', async () => {
		const rc = await drcm.list('someUid');
		should.equal(1, rc.length);
		should.equal(dcr.uid, rc[0].uid);
		should.equal(dcr.deviceUid, rc[0].deviceUid);
		should.equal(dcr.enabled, rc[0].enabled);
		should.deepEqual(dcr.createdAt, rc[0].createdAt);
		should.equal(dcr.succeededAt, rc[0].succeededAt);
		should.equal(dcr.failedAt, rc[0].failedAt);
	});

	it('should enable the remote control', async () => {
		await drcm.set('someUid', validSetReq);
		should(true).true();
	});
});
