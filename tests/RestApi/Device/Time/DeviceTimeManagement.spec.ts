import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import IDeviceTime, {IDeviceTimeUpdatable} from "../../../../src/RestApi/Device/Time/IDeviceTime";
import DeviceTimeManagement from "../../../../src/RestApi/Device/Time/DeviceTimeManagement";

describe('DeviceTimeManagement', () => {

	const validGetResp: IDeviceTime = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		timestamp: 1536476974001,
		timezone: 'Europe/Prague',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		failedAt: null,
	};
	const validSetReq: IDeviceTimeUpdatable = {
		time: '2018-09-09T09:09:34.001',
		timezone: 'Europe/Prague',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/time').reply(200, validGetResp)
		.put('/v1/device/someUid/time', validSetReq).reply(200, 'OK');

	const dtm = new DeviceTimeManagement(nockOpts);

	it('should get the device time', async () => {
		const t = await dtm.get('someUid');
		should.equal(validGetResp.uid, t.uid);
		should.equal(validGetResp.timestamp, t.timestamp);
		should.equal(validGetResp.timezone, t.timezone);
	});

	it('should set the device time', async () => {
		await dtm.set('someUid', validSetReq);
		should(true).true();
	});
});
