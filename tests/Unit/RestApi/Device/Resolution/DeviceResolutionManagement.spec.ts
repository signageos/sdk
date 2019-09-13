import * as should from 'should';
import * as nock from "nock";
import { nockOpts, successRes } from "../../helper";
import IDeviceResolution, {
	DeviceResolutionOrientation as Orientation,
	DeviceResolutionResolution as Resolution,
	IDeviceResolutionUpdatable
} from "../../../../../src/RestApi/Device/Resolution/IDeviceResolution";
import DeviceResolutionManagement from "../../../../../src/RestApi/Device/Resolution/DeviceResolutionManagement";

describe('DeviceResolutionManagement', () => {

	const resol: IDeviceResolution = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		orientation: Orientation.Landscape,
		resolution: Resolution.HDReady,
		videoOrientation: null,
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null
	};
	const validGetResp: IDeviceResolution[] = [resol];
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
		.put('/v1/device/someUid/resolution', validSetReq).reply(200, successRes);

	const drm = new DeviceResolutionManagement(nockOpts);

	it('should get the resolution info', async () => {
		const res = await drm.list('someUid');
		should.equal(1, res.length);
		const r = res[0];

		should.equal(resol.uid, r.uid);
		should.equal(resol.deviceUid, r.deviceUid);
		should.equal(resol.orientation, r.orientation);
		should.equal(resol.resolution, r.resolution);
		should.equal(resol.videoOrientation, r.videoOrientation);
	});

	it('should set resolution info', async () => {
		await drm.set('someUid', validSetReq);
		should(true).true();
	});
});
