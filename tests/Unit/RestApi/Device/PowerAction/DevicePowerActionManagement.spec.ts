import * as should from 'should';
import * as nock from 'nock';
import {nockOpts} from '../../helper';
import IPowerAction, {
	DevicePowerAction,
	IPowerActionUpdatable
} from "../../../../../src/RestApi/Device/PowerAction/IPowerAction";
import DevicePowerActionManagement from "../../../../../src/RestApi/Device/PowerAction/DevicePowerActionManagement";

describe('DevicePowerActionManagement', () => {

	const validGetResp: IPowerAction = {
		uid: 'someUid',
		deviceUid: '206aXXXaa72',
		powerType: DevicePowerAction.DisplayPowerOn,
		createdAt: new Date('2018-07-26T17:13:36.160Z'),
		succeededAt: new Date('2018-07-26T17:13:42.054Z'),
		failedAt: null
	};
	const validSetReq: IPowerActionUpdatable = {
		devicePowerAction: DevicePowerAction.SystemReboot,
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				'x-auth': `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/power-action').reply(200, validGetResp)
		.put('/v1/device/someUid/power-action', validSetReq).reply(200, 'OK');

	const dpam = new DevicePowerActionManagement(nockOpts);

	it('should get the device power action', async () => {
		const pa = await dpam.get('someUid');
		should.equal(validGetResp.uid, pa.uid);
		should.equal(validGetResp.powerType, pa.powerType);
	});

	it('should set the device power action', async () => {
		await dpam.set('someUid', validSetReq);
		should(true).true();
	});

});
