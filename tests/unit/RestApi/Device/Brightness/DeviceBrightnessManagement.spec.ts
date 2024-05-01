import * as should from 'should';
import * as nock from 'nock';

import DeviceBrightnessManagement from '../../../../../src/RestApi/Device/Brightness/DeviceBrightnessManagement';
import IDeviceBrightness, { IDeviceBrightnessUpdatable } from '../../../../../src/RestApi/Device/Brightness/IDeviceBrightness';
import { errorResp, errorRespMessage, getNockOpts, successRes } from '../../helper';

const nockOpts = getNockOpts({});

describe('DeviceBrightnessManagement', () => {
	const brightness: IDeviceBrightness = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		brightness1: 86,
		timeFrom1: '03:00:00',
		brightness2: 25,
		timeFrom2: '23:00:00',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	};
	const validGetResp: IDeviceBrightness[] = [brightness];
	const validSetReq: IDeviceBrightnessUpdatable = {
		brightness1: 86,
		timeFrom1: '03:00:00',
		brightness2: 25,
		timeFrom2: '23:00:00',
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/device/someUid/brightness')
		.reply(200, validGetResp)
		.get('/v1/device/shouldFail/brightness')
		.reply(500, errorResp)
		.put('/v1/device/someUid/brightness', validSetReq as {})
		.reply(200, successRes)
		.put('/v1/device/shouldFail/brightness', validSetReq as {})
		.reply(500, errorResp);

	const dbm = new DeviceBrightnessManagement(nockOpts);

	describe('get device brightness settings', () => {
		it('should parse the response', async () => {
			const br = await dbm.list('someUid');
			should.equal(1, br.length);
			should.equal('someUid', br[0].uid);
			should.equal(86, br[0].brightness1);
			should.equal('03:00:00', br[0].timeFrom1);
			should.equal(25, br[0].brightness2);
			should.equal('23:00:00', br[0].timeFrom2);
		});

		it('should throw error', async () => {
			try {
				await dbm.list('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('setBrightness', () => {
		it('should set brightness correctly', async () => {
			await dbm.set('someUid', validSetReq);
			should(true).true();
		});

		it('should fail when api returns non 200 status', async () => {
			try {
				await dbm.set('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});
