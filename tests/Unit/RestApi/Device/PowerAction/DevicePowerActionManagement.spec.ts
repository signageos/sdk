import * as should from 'should';
import * as nock from 'nock';
import { nockOpts, successRes } from '../../helper';
import IPowerAction, {
	DevicePowerAction,
	IPowerActionUpdatable,
} from "../../../../../src/RestApi/Device/PowerAction/IPowerAction";
import DevicePowerActionManagement from "../../../../../src/RestApi/Device/PowerAction/DevicePowerActionManagement";

describe('DevicePowerActionManagement', () => {

	const pa: IPowerAction = {
		uid: 'someUid',
		deviceUid: '206aXXXaa72',
		powerType: DevicePowerAction.DisplayPowerOn,
		createdAt: new Date('2018-07-26T17:13:36.160Z'),
		succeededAt: new Date('2018-07-26T17:13:42.054Z'),
		failedAt: null,
	};
	const validGetResp: IPowerAction[] = [pa];
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
		.put('/v1/device/someUid/power-action', validSetReq).reply(200, successRes);

	const dpam = new DevicePowerActionManagement(nockOpts);

	it('should get the device power actions', async () => {
		const pwr = await dpam.list('someUid');
		should.equal(1, pwr.length);
		should.equal(pa.uid, pwr[0].uid);
		should.equal(pa.powerType, pwr[0].powerType);
	});

	it('should set the device power action', async () => {
		await dpam.set('someUid', validSetReq);
		should(true).true();
	});

});
