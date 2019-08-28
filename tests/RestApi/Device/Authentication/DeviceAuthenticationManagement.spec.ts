import * as should from 'should';
import * as nock from "nock";
import {nockOpts} from "../../helper";
import IDeviceAuthentication from "../../../../src/RestApi/Device/Authentication/IDeviceAuthentication";
import DeviceAuthenticationManagement
	from "../../../../src/RestApi/Device/Authentication/DeviceAuthenticationManagement";

describe('DeviceAuthenticationManagement', () => {

	const validGetResp: IDeviceAuthentication = {
		deviceUid: '3ca8aXXXe589b',
		authHash: '5b911d55d5b0cc001820f001',
		createdAt: new Date('2018-02-15T08:28:53.451Z'),
	};

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.get('/v1/device/someUid/authentication').reply(200, validGetResp);

	it('get the device authentication hash', async () => {
		const dam = new DeviceAuthenticationManagement(nockOpts);
		const auth = await dam.get('someUid');
		should.equal(validGetResp.deviceUid, auth.deviceUid);
		should.equal(validGetResp.authHash, auth.authHash);
		should.deepEqual(validGetResp.createdAt, auth.createdAt);
	});
});
