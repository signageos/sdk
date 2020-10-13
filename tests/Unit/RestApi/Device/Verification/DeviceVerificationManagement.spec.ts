import * as should from 'should';
import * as nock from "nock";
import { nockOpts, successRes } from "../../helper";
import IDeviceVerification, { IDeviceVerificationUpdatable } from "../../../../../src/RestApi/Device/Verification/IDeviceVerification";
import DeviceVerificationManagement from "../../../../../src/RestApi/Device/Verification/DeviceVerificationManagement";

describe('DeviceVerificationManagement', () => {

	const validPostRespHeaders: nock.HttpHeaders = {
		'Location': 'https://example.com/v1/device/verification/someUid',
	};
	const validGetResp: IDeviceVerification = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		hash: 'cc5d2c',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		verifiedAt: null,
	};
	const validSetReq: IDeviceVerificationUpdatable = {
		verificationHash: 'ae23ef',
	};
	const invalidSetReq: IDeviceVerificationUpdatable = {
		verificationHash: 'non-existing',
	};

	const dvm = new DeviceVerificationManagement(nockOpts);

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/verification/someUid').reply(200, validGetResp)
		.post('/v1/device/verification', validSetReq).reply(200, successRes, validPostRespHeaders)
		.get('/v1/device/verification/someUid').reply(200, validGetResp)
		.post('/v1/device/verification', invalidSetReq).reply(
			404,
			{ message: "Device verification was not found by hash cc5d2c: undefined", "data": {}},
		);

	describe('get device verification', () => {
		it('should parse the response', async () => {
			const app = await dvm.get('someUid');
			should.equal('cc5d2c', app.hash);
			should.equal(null, app.verifiedAt);
		});
	});

	describe('set device verification', () => {
		it('should set the verification hash', async () => {
			await dvm.set(validSetReq);
			should(true).true();
		});

		it('should fail on 404 error', async () => {
			try {
				await dvm.set(invalidSetReq);
			} catch (e) {
				should(e.message.includes('Device verification was not found by hash cc5d2c')).true();
			}
		});
	});
});
