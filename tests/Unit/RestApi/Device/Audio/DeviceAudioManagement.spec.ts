import * as should from 'should';
import * as nock from "nock";
import { errorResp, errorRespMessage, nockOpts, successRes } from "../../helper";
import IDeviceAudio, {IDeviceAudioUpdatable} from "../../../../../src/RestApi/Device/Audio/IDeviceAudio";
import DeviceAudioManagement from "../../../../../src/RestApi/Device/Audio/DeviceAudioManagement";

describe('DeviceAudioManagement', () => {

	const validGetResp: IDeviceAudio[] = [{
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		volume: 56,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
	}];
	const validSetReq: IDeviceAudioUpdatable = {
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
		.put('/v1/device/someUid/volume', validSetReq).reply(200, successRes)
		.put('/v1/device/shouldFail/volume', validSetReq).reply(500, errorResp);

	const dvm = new DeviceAudioManagement(nockOpts);

	describe('get device volume', () => {
		it('should parse the response', async () => {
			const vols = await dvm.get('someUid');
			should.equal(1, vols.length);
			should.equal('someUid', vols[0].uid);
			should.equal(56, vols[0].volume);
		});

		it('should throw error', async () => {
			try {
				await dvm.get('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('set device volume', () => {
		it('should set volume correctly', async () => {
			await dvm.set('someUid', validSetReq);
			should(true).true();
		});

		it('should fail when api returns non 200 status', async () => {
			try {
				await dvm.set('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});
