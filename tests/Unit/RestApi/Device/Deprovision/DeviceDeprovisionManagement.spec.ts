import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import DeviceDeprovisionManagement from "../../../../../src/RestApi/Device/Deprovision/DeviceDeprovisionManagement";
import IDeviceChangeResponse from "../../../../../src/RestApi/Device/IDeviceChangeResponse";

describe('DeviceDeprovisionManagement', () => {

	const validPutResp: IDeviceChangeResponse = {
		message: 'OK',
		requestUid: '5b911d55d5b0cc001820f001',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.put('/v1/device/someUid/deprovision').reply(200, validPutResp);

	it('deprovisions the device', async () => {
		const ddm = new DeviceDeprovisionManagement(nockOpts);
		const deprovision = await ddm.deprovision('someUid');
		should.equal('OK', deprovision.message);
		should.equal('5b911d55d5b0cc001820f001', deprovision.requestUid);
	});
});
