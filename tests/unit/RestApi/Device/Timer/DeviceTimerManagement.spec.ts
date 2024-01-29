import * as should from 'should';
import * as nock from 'nock';

import { getNockOpts, successRes } from '../../helper';
import {
	DeviceTimerLevel,
	DeviceTimerType,
	DeviceTimerWeekday as day,
	IDeviceTimerUpdatable,
} from '../../../../../src/RestApi/Device/Timer/IDeviceTimer';
import DeviceTimerManagement from '../../../../../src/RestApi/Device/Timer/DeviceTimerManagement';

const nockOpts = getNockOpts({});

describe('DeviceTimerManagement', () => {
	const tmr: any = {
		uid: '0836b9XX044f68',
		deviceUid: '21adXXXdb93',
		type: 'TIMER_2',
		level: DeviceTimerLevel.Proprietary,
		timeOn: '10:30:00',
		timeOff: '22:00:00',
		weekdays: ['mon', 'fri'],
		volume: 55,
		createdAt: new Date('2017-08-07T16:03:55.825Z'),
		succeededAt: new Date('2017-08-07T16:03:57.563Z'),
		failedAt: null,
	};
	const validGetResp: any[] = [tmr];
	const validSetReq: IDeviceTimerUpdatable = {
		type: DeviceTimerType.Timer4,
		timeOn: '03:02:01',
		timeOff: '04:02:01',
		volume: 34,
		weekdays: [day.Saturday, day.Sunday],
		level: DeviceTimerLevel.Proprietary,
	};

	nock(nockOpts.url, {
		reqheaders: {
			'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
		},
	})
		.get('/v1/device/someUid/timer-settings')
		.reply(200, validGetResp)
		.put('/v1/device/someUid/timer-settings', validSetReq)
		.reply(200, successRes);

	const dtm = new DeviceTimerManagement(nockOpts);

	it('should get the device timers', async () => {
		const timers = await dtm.list('someUid');
		should.equal(1, timers.length);

		const t = timers[0];
		should.equal(tmr.uid, t.uid);
		should.equal(tmr.type, t.type);
		should.equal(tmr.level, t.level);
		should.equal(tmr.timeOn, t.timeOn);
		should.equal(tmr.timeOff, t.timeOff);
		should.deepEqual(tmr.weekdays, t.weekdays);
		should.deepEqual(tmr.weekdays, [day.Monday, day.Friday]);
	});

	it('should set the device timer', async () => {
		await dtm.set('someUid', validSetReq);
		should(true).true();
	});
});
