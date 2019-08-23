import * as should from 'should';
import * as nock from "nock";
import DeviceBrightnessManagement from "../../../../src/RestApi/Device/Brightness/DeviceBrightnessManagement";
import IDeviceBrightness, {IDeviceBrightnessUpdatable} from "../../../../src/RestApi/Device/Brightness/IDeviceBrightness";
import {errorRespMessage, nockOpts} from "../../helper";

describe('DeviceBrightnessManagement', () => {

	const invalidResp: any = {"error": "some error"};
	const validGetResp: IDeviceBrightness = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		brightness1: 86,
		timeFrom1: '03:00:00',
		brightness2: 25,
		timeFrom2: '23:00:00',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null
	};
	const validSetReq: IDeviceBrightnessUpdatable = {
		brightness1: 86,
		timeFrom1: '03:00:00',
		brightness2: 25,
		timeFrom2: '23:00:00',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/brightness').reply(200, validGetResp)
		.get('/v1/device/shouldFail/brightness').reply(500, invalidResp)
		.put('/v1/device/someUid/brightness', validSetReq).reply(200, 'OK')
		.put('/v1/device/shouldFail/brightness', validSetReq).reply(500, {"error": "some error"});

	describe('getBrightness', () => {
		it('should parse the response', async () => {
			const dbm = new DeviceBrightnessManagement(nockOpts);
			const pin = await dbm.get('someUid');
			should.equal('someUid', pin.uid);
			should.equal(86, pin.brightness1);
			should.equal('03:00:00', pin.timeFrom1);
			should.equal(25, pin.brightness2);
			should.equal('23:00:00', pin.timeFrom2);
		});

		it('should throw error', async () => {
			const dbm = new DeviceBrightnessManagement(nockOpts);
			try {
				await dbm.get('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('setBrightness', () => {
		it('should set brightness correctly', async () => {
			const dbm = new DeviceBrightnessManagement(nockOpts);
			await dbm.set('someUid', validSetReq);
		});

		it('should fail when api returns non 200 status', async () => {
			const dbm = new DeviceBrightnessManagement(nockOpts);
			try {
				await dbm.set('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});
