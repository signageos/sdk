import * as should from 'should';
import * as nock from 'nock';
import { nockOpts, successRes } from '../../helper';
import {DevicePowerAction} from "../../../../../src/RestApi/Device/PowerAction/IPowerAction";
import DeviceScheduledPowerActionManagement
	from "../../../../../src/RestApi/Device/PowerAction/DeviceScheduledPowerActionManagement";
import IScheduledPowerAction, {
	IScheduledPowerActionCreatable,
	SheduledActionDay
} from "../../../../../src/RestApi/Device/PowerAction/IScheduledPowerAction";

describe('DeviceScheduledPowerActionManagement', () => {

	const pa: IScheduledPowerAction = {
		uid: 'someUid',
		deviceUid: '206aXXXaa72',
		powerAction: DevicePowerAction.DisplayPowerOn,
		weekdays: [SheduledActionDay.Monday],
		time: '08:00:00',
		createdAt: new Date('2018-07-26T17:13:36.160Z'),
	};
	const validGetResp: IScheduledPowerAction[] = [pa];
	const validCreateReq: IScheduledPowerActionCreatable = {
		powerAction: DevicePowerAction.DisplayPowerOff,
		weekdays: [SheduledActionDay.Saturday],
		time: '12:00:00'
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/scheduled-power-action').reply(200, validGetResp)
		.post('/v1/device/someUid/scheduled-power-action', validCreateReq).reply(200, successRes)
		.get('/v1/device/someUid/scheduled-power-action/scheduledActionId').reply(200, pa)
		.delete('/v1/device/someUid/scheduled-power-action/scheduledActionId').reply(200, successRes);

	const dspam = new DeviceScheduledPowerActionManagement(nockOpts);

	it('should get the device scheduled power actions list', async () => {
		const spa = await dspam.list('someUid');
		should.equal(1, spa.length);
		should.equal(pa.uid, spa[0].uid);
		should.equal(pa.powerAction, spa[0].powerAction);
		should.equal('DISPLAY_POWER_ON', spa[0].powerAction); // to verify the enum value
	});

	it('should create new scheduled device power action', async () => {
		await dspam.create('someUid', validCreateReq);
		should(true).true();
	});

	it('should get the device scheduled power actions detail', async () => {
		const spa = await dspam.get('someUid', 'scheduledActionId');
		should.equal(pa.uid, spa.uid);
		should.equal(pa.powerAction, spa.powerAction);
		should.equal('DISPLAY_POWER_ON', spa.powerAction); // to verify the enum value
	});

	it('should delete the scheduled device power action', async () => {
		await dspam.cancel('someUid', 'scheduledActionId');
		should(true).true();
	});

});
