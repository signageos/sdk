import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import IDeviceResolution, {
	DeviceResolutionOrientation as Orientation,
	DeviceResolutionResolution as Resolution,
	IDeviceResolutionUpdatable
} from "../../../../../src/RestApi/Device/Resolution/IDeviceResolution";
import DeviceResolutionManagement from "../../../../../src/RestApi/Device/Resolution/DeviceResolutionManagement";

describe('DeviceResolutionManagement', () => {

	const validGetResp: IDeviceResolution = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		orientation: Orientation.Landscape,
		resolution: Resolution.HDReady,
		videoOrientation: null,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null
	};
	const validSetReq: IDeviceResolutionUpdatable = {
		orientation: Orientation.Portrait,
		resolution: Resolution.FullHD,
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/resolution').reply(200, validGetResp)
		.put('/v1/device/someUid/resolution', validSetReq).reply(200, 'OK');

	const drm = new DeviceResolutionManagement(nockOpts);

	it('should get the resolution info', async () => {
		const res = await drm.get('someUid');
		should.equal(validGetResp.uid, res.uid);
		should.equal(validGetResp.deviceUid, res.deviceUid);
		should.equal(validGetResp.orientation, res.orientation);
		should.equal(validGetResp.resolution, res.resolution);
		should.equal(validGetResp.videoOrientation, res.videoOrientation);
	});

	it('should set resolution info', async () => {
		await drm.set('someUid', validSetReq);
		should(true).true();
	});
});
