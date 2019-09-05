import * as should from 'should';
import * as nock from "nock";
import { nockOpts, successRes } from "../../helper";
import IDeviceDateTime, {IDeviceDateTimeUpdatable} from "../../../../../src/RestApi/Device/DateTime/IDeviceDateTime";
import DeviceDateTimeManagement from "../../../../../src/RestApi/Device/DateTime/DeviceDateTimeManagement";

describe('DeviceDateTimeManagement', () => {

	const datetime: IDeviceDateTime = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		timestamp: 1536476974001,
		timezone: 'Europe/Prague',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		failedAt: null,
	};
	const validGetResp: IDeviceDateTime[] = [datetime];
	const validSetReq: IDeviceDateTimeUpdatable = {
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
		.put('/v1/device/someUid/time', validSetReq).reply(200, successRes);

	const dtm = new DeviceDateTimeManagement(nockOpts);

	it('should get the device time', async () => {
		const t = await dtm.get('someUid');
		should.equal(1, t.length);
		should.equal(datetime.uid, t[0].uid);
		should.equal(datetime.timestamp, t[0].timestamp);
		should.equal(datetime.timezone, t[0].timezone);
	});

	it('should set the device time', async () => {
		await dtm.set('someUid', validSetReq);
		should(true).true();
	});
});
