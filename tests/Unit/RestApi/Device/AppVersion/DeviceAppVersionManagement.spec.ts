import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import IDeviceAppVersion, {IDeviceAppVersionUpdatable} from "../../../../../src/RestApi/Device/AppVersion/IDeviceAppVersion";
import DeviceAppVersionManagement from "../../../../../src/RestApi/Device/AppVersion/DeviceAppVersionManagement";

describe('DeviceAppVersionManagement', () => {

	const validGetResp: IDeviceAppVersion = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		version: '1.0.0',
		applicationType: 'tizen',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	};
	const validSetReq: IDeviceAppVersionUpdatable = {
		version: '1.0.1',
		applicationType: 'tizen',
	};

	const davm = new DeviceAppVersionManagement(nockOpts);

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/application/version').reply(200, validGetResp)
		.put('/v1/device/someUid/application/version', validSetReq).reply(200, "OK");

	describe('get application version', () => {
		it('should parse the response', async () => {
			const app = await davm.get('someUid');
			should.equal('tizen', app.applicationType);
			should.equal('1.0.0', app.version);
		});
	});

	describe('set application version', () => {
		it('should set app version', async () => {
			await davm.set('someUid', validSetReq);
			should(true).true();
		});
	});
});
