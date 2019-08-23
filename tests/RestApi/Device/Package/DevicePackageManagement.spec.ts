import * as should from 'should';
import * as nock from "nock";
import {errorResp, errorRespMessage, nockOpts} from "../../helper";
import IDevicePackage, {IDevicePackageUpdatable} from "../../../../src/RestApi/Device/Package/IDevicePackage";
import DevicePackageManagement from "../../../../src/RestApi/Device/Package/DevicePackageManagement";

describe('DevicePackageManagement', () => {

	const validGetResp: IDevicePackage = {
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
		.put('/v1/device/someUid/package-install', validSetReq).reply(200, 'OK')
		.put('/v1/device/shouldFail/package-install', validSetReq).reply(500, errorResp);

	describe('get device package installs', () => {
		it('should parse the response', async () => {
			const dpm = new DevicePackageManagement(nockOpts);
			const pkg = await dpm.get('someUid');
			should.equal('someUid', pkg.uid);
			should.equal('com.google.android.webview', pkg.packageName);
			should.equal('62.0.3202.66', pkg.version);
			should.equal('320206650', pkg.build);
		});

		it('should throw error', async () => {
			const dpm = new DevicePackageManagement(nockOpts);
			try {
				await dpm.get('shouldFail');
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});

	describe('set device package installs', () => {
		it('should set brightness correctly', async () => {
			const dpm = new DevicePackageManagement(nockOpts);
			await dpm.install('someUid', validSetReq);
		});

		it('should fail when api returns non 200 status', async () => {
			const dpm = new DevicePackageManagement(nockOpts);
			try {
				await dpm.install('shouldFail', validSetReq);
			} catch (e) {
				should(e.message).equal(errorRespMessage(500));
			}
		});
	});
});
