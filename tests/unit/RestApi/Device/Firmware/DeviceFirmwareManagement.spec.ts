import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts } from '../../helper';
import IDeviceChangeResponse from '../../../../../src/RestApi/Device/IDeviceChangeResponse';
import DeviceFirmwareManagement from '../../../../../src/RestApi/Device/Firmware/DeviceFirmwareManagement';
import IDeviceFirmware, { IDeviceFirmwareUpdatable } from '../../../../../src/RestApi/Device/Firmware/IDeviceFirmware';

const nockOpts = getNockOpts({});

describe('DeviceFirmwareManagement', () => {
	const validGetResp: IDeviceFirmware = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		version: 'T-HKMLAKUC-2020.5',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
	};
	const validSetReq: IDeviceFirmwareUpdatable = {
		version: 'T-HKMLAKUC-2020.6',
	};
	const validSetResp: IDeviceChangeResponse = {
		message: 'OK',
		requestUid: '5b911d55d5b0cc001820f001',
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/device/someUid/firmware')
		.reply(200, validGetResp)
		.put('/v1/device/someUid/firmware', validSetReq as {})
		.reply(200, validSetResp);

	const dfm = new DeviceFirmwareManagement(nockOpts);

	it('get the device firmware', async () => {
		const fw = await dfm.get('someUid');
		should.equal(validGetResp.uid, fw.uid);
		should.equal(validGetResp.version, fw.version);
		should.equal(validGetResp.deviceUid, fw.deviceUid);
		should.deepEqual(validGetResp.createdAt, fw.createdAt);
	});

	it('get the device firmware', async () => {
		const fw = await dfm.set('someUid', validSetReq);
		should.equal('OK', fw.message);
		should.equal('5b911d55d5b0cc001820f001', fw.requestUid);
	});
});
