import * as nock from 'nock';
import { random } from 'faker';
import * as should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import DeviceLocationManagement from '../../../../../src/RestApi/Device/Location/DeviceLocationManagement';
import { Resources } from '../../../../../src/RestApi/resources';
import { LOCATION_1 } from '../../../../Integration/RestAPI/Location/Location.fixtures';
import { nockOpts, nockAuthHeader } from '../../helper';
import { DEVICE_1 } from '../Device.fixtures';

const deviceLocationManagement = new DeviceLocationManagement(nockOpts);

describe('Unit.RestApi.Device.Location', () => {
	nock(nockOpts.url, nockAuthHeader)
		.put(`/${ApiVersions.V1}/${Resources.Device}/${DEVICE_1.uid}/${Resources.Location}/${LOCATION_1.uid}`)
		.reply(200, { ...DEVICE_1, locationUid: random.uuid() })
		.delete(`/${ApiVersions.V1}/${Resources.Device}/${DEVICE_1.uid}/${Resources.Location}/${LOCATION_1.uid}`)
		.reply(200, { ...DEVICE_1, locationUid: random.uuid() });

	it('should assign and unassign location to and from device', async () => {
		await should(deviceLocationManagement.assign(DEVICE_1.uid, LOCATION_1.uid)).be.fulfilled();
		await should(deviceLocationManagement.unassign(DEVICE_1.uid, LOCATION_1.uid)).be.fulfilled();
	});
});
