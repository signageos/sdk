import * as should from 'should';
import * as nock from "nock";
import { errorResp, errorRespMessage, nockOpts, successRes } from "../../helper";
import IDevicePackage, {IDevicePackageUpdatable} from "../../../../../src/RestApi/Device/Package/IDevicePackage";
import DevicePackageManagement from "../../../../../src/RestApi/Device/Package/DevicePackageManagement";

describe('DevicePackageManagement', () => {

	const dPkg: IDevicePackage = {
		uid: 'someUid',
		deviceUid: '3caXXX589b',
		packageName: 'com.google.android.webview',
		version: '62.0.3202.66',
		build: '320206650',
		createdAt: new Date('2018-05-23T14:37:07.362Z'),
		succeededAt: null,
		failedAt: null,
		postponedAt: null,
	};
	const validGetResp: IDevicePackage[] = [dPkg];
	const validSetReq: IDevicePackageUpdatable = {
		packageName: 'com.google.android.webview',
		version: '62.0.3202.66',
		build: '320206650',
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/package-install').reply(200, validGetResp)
		.get('/v1/device/shouldFail/package-install').reply(500, errorResp)
		.put('/v1/device/someUid/package-install', validSetReq).reply(200, successRes)
		.put('/v1/device/shouldFail/package-install', validSetReq).reply(500, errorResp);

	const dpm = new DevicePackageManagement(nockOpts);

	describe('get device package installs', () => {
		it('should parse the response', async () => {
			const pkg = await dpm.list('someUid');
			should.equal(1, pkg.length);
			should.equal(dPkg.uid, pkg[0].uid);
			should.equal(dPkg.packageName, pkg[0].packageName);
			should.equal(dPkg.version, pkg[0].version);
			should.equal(dPkg.build, pkg[0].build);
		});

		it('should throw error', async () => {
			try {
				await dpm.list('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('set device package installs', () => {
		it('should set package installs correctly', async () => {
			await dpm.install('someUid', validSetReq);
		});

		it('should fail when api returns non 200 status', async () => {
			try {
				await dpm.install('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});
