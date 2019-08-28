import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import IDeviceRemoteControl, {IDeviceRemoteControlUpdatable} from "../../../../src/RestApi/Device/RemoteControl/IDeviceRemoteControl";
import DeviceRemoteControlManagement from "../../../../src/RestApi/Device/RemoteControl/DeviceRemoteControlManagement";

describe('DeviceRemoteControlManagement', () => {

	const validGetResp: IDeviceRemoteControl = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		enabled: false,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	};
	const validSetReq: IDeviceRemoteControlUpdatable = {
		enabled: false,
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/remote-control').reply(200, validGetResp)
		.put('/v1/device/someUid/remote-control', validSetReq).reply(200, 'OK');

	const drcm = new DeviceRemoteControlManagement(nockOpts);

	it('should get the remote control information', async () => {
		const rc = await drcm.get('someUid');
		should.equal(validGetResp.uid, rc.uid);
		should.equal(validGetResp.deviceUid, rc.deviceUid);
		should.equal(validGetResp.enabled, rc.enabled);
		should.deepEqual(validGetResp.createdAt, rc.createdAt);
		should.equal(validGetResp.succeededAt, rc.succeededAt);
		should.equal(validGetResp.failedAt, rc.failedAt);
	});

	it('should enable the remote control', async () => {
		await drcm.set('someUid', validSetReq);
		should(true).true();
	});
});
