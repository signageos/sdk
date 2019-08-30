import * as should from 'should';
import * as nock from "nock";
import DevicePinManagement from "../../../../../src/RestApi/Device/Pin/DevicePinManagement";
import IDevicePin from "../../../../../src/RestApi/Device/Pin/IDevicePin";
import {errorResp, errorRespMessage, nockOpts} from "../../helper";

describe('DevicePinManagement', () => {

	const validResp: IDevicePin = {deviceUid: 'someUid', pinCode: '1234'};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/pin-code').reply(200, validResp)
		.get('/v1/device/shouldFail/pin-code').reply(500, errorResp);

	it('should parse the response', async () => {
		const dpm = new DevicePinManagement(nockOpts);
		const pin = await dpm.get('someUid');
		should.equal('1234', pin.pinCode);
		should.equal('someUid', pin.deviceUid);
	});

	it('should throw error when api returns non 200', async () => {
		const dpm = new DevicePinManagement(nockOpts);
		try {
			await dpm.get('shouldFail');
		} catch (e) {
			should(e.message).equal(errorRespMessage(500));
		}
	});
});
