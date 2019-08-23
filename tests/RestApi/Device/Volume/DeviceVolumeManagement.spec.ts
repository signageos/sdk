import * as should from 'should';
import * as nock from "nock";
import {errorResp, errorRespMessage, nockOpts} from "../../helper";
import IDeviceVolume, {IDeviceVolumeUpdatable} from "../../../../src/RestApi/Device/Volume/IDeviceVolume";
import DeviceVolumeManagement from "../../../../src/RestApi/Device/Volume/DeviceVolumeManagement";

describe('DeviceVolumeManagement', () => {

	const validGetResp: IDeviceVolume = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		volume: 56,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	};
	const validSetReq: IDeviceVolumeUpdatable = {
		volume: 90,
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/volume').reply(200, validGetResp)
		.get('/v1/device/shouldFail/volume').reply(500, errorResp)
		.put('/v1/device/someUid/volume', validSetReq).reply(200, {volume: 90})
		.put('/v1/device/shouldFail/volume', validSetReq).reply(500, errorResp);

	describe('get device Volume installs', () => {
		it('should parse the response', async () => {
			const dvm = new DeviceVolumeManagement(nockOpts);
			const vol = await dvm.get('someUid');
			should.equal('someUid', vol.uid);
			should.equal(56, vol.volume);
		});

		it('should throw error', async () => {
			const dvm = new DeviceVolumeManagement(nockOpts);
			try {
				await dvm.get('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('set device Volume installs', () => {
		it('should set brightness correctly', async () => {
			const dvm = new DeviceVolumeManagement(nockOpts);
			const currentVol = await dvm.set('someUid', validSetReq);
			should.equal(90, currentVol);
		});

		it('should fail when api returns non 200 status', async () => {
			const dvm = new DeviceVolumeManagement(nockOpts);
			try {
				await dvm.set('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});
