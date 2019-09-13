import * as nock from "nock";
import { nockOpts, successRes } from "../../helper";
import DeviceProvisioningManagement from "../../../../../src/RestApi/Device/Provisioning/DeviceProvisioningManagement";

describe('DeviceProvisioningManagement', () => {

	nock(
		nockOpts.url, {
			reqheaders: {
				"x-auth": `${nockOpts.auth.clientId}:${nockOpts.auth.secret}`, // checks the x-auth header presence
			},
		})
		.put('/v1/device/someUid/deprovision').reply(200, successRes);

	const ddm = new DeviceProvisioningManagement(nockOpts);

	it('deprovisions the device', async () => {
		await ddm.deprovision('someUid');
	});
});
