import * as nock from 'nock';
import * as should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import DeviceManagementV2 from '../../../../../src/RestApi/V2/Device/DeviceManagement';
import { Resources } from '../../../../../src/RestApi/resources';
import { SocketDriver, IDeviceUpdatable } from '../../../../../src/RestApi/V2/Device/Device';
import { DEVICE_V2_1, DEVICE_V2_2 } from '../../../../fixtures/V2/Device/Device.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';

const nockOptsV2 = getNockOpts({ version: ApiVersions.V2 });
const deviceManagementV2 = new DeviceManagementV2(nockOptsV2);

describe('Unit.RestApi.V2.Device', () => {
	it('get device list', async () => {
		nock(nockOptsV2.url, nockAuthHeader1).get(`/${ApiVersions.V2}/${Resources.Device}`).reply(200, [DEVICE_V2_1, DEVICE_V2_2]);

		const devices = await deviceManagementV2.list();

		should(devices.length).be.eql(2);
	});

	it('get one device', async () => {
		nock(nockOptsV2.url, nockAuthHeader1).get(`/${ApiVersions.V2}/${Resources.Device}/${DEVICE_V2_1.uid}`).reply(200, DEVICE_V2_1);

		const device = await deviceManagementV2.get(DEVICE_V2_1.uid);

		should(device.uid).be.eql(device.uid);
	});

	it('set device settings', async () => {
		const settings: IDeviceUpdatable = {
			name: 'test',
			connectionMethod: SocketDriver.Http,
		};

		nock(nockOptsV2.url, nockAuthHeader1).put(`/${ApiVersions.V2}/${Resources.Device}/${DEVICE_V2_1.uid}`).reply(200);

		await should(deviceManagementV2.set(DEVICE_V2_1.uid, settings)).be.fulfilled();
	});
});
