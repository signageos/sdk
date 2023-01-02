import * as should from 'should';
import * as nock from 'nock';

import DevicePinCodeManagement from '../../../../../src/RestApi/Device/PinCode/DevicePinCodeManagement';
import IDevicePin from '../../../../../src/RestApi/Device/PinCode/IDevicePin';
import { errorResp, errorRespMessage, getNockOpts } from '../../helper';

const nockOpts = getNockOpts({});

describe('DevicePinCodeManagement', () => {

	const validResp: IDevicePin = {
		deviceUid: 'someUid',
		pinCode: '1234',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/pin-code').reply(200, validResp)
		.get('/v1/device/shouldFail/pin-code').reply(500, errorResp);

	const dpm = new DevicePinCodeManagement(nockOpts);

	it('should parse the response', async () => {
		const pin = await dpm.get('someUid');
		should.equal(validResp.pinCode, pin.pinCode);
		should.equal(validResp.deviceUid, pin.deviceUid);
	});

	it('should throw error when api returns non 200', async () => {
		try {
			await dpm.get('shouldFail');
		} catch (e) {
			should(e.message).equal(errorRespMessage(500));
		}
	});
});
