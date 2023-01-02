import * as should from 'should';

import { createApiV2 } from '../../../../../src';
import IDeviceV2 from '../../../../../src/RestApi/V2/Device/Device';
import { opts } from '../../helper';

const api = createApiV2(opts);

describe('RestAPI - Device', function () {

	it('should get the list of existing devices', async () => {
		const devices = await api.device.list();
		should(Array.isArray(devices)).true();
		should(devices.length > 0).true();

		// save for later tests
		const device = devices[0] as IDeviceV2;

		should(device.uid.length > 0).true();
		should(device.name.length > 0).true();
		should(device.organizationUid.length > 0).true();
		should(device.createdAt.getTime() > 0).true();
	});

	it('should get the device  by its uid', async function () {
		const device = (await api.device.list())[0];
		const dvc = await api.device.get(device.uid);
		should.equal(device.uid, dvc.uid);
	});
});
