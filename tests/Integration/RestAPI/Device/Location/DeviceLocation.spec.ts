import * as should from 'should';

import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';
import { opts, ALLOWED_TIMEOUT, preRunCheck, getOrganizationUid } from '../../helper';
import { LOCATION_CREATE_1 } from '../../Location/Location.fixtures';
import { handleCreateLocation } from '../../Location/Location.utils';

const api = new Api(opts);

describe('Integration.RestAPI.Device.Location.DeviceLocation', async () => {
	before(function () {
		preRunCheck(this.skip.bind(this));
	});

	it('should assign and unassign location to and from device', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});

		// TODO: This approach is taken from the Device, since there is no create method. This should be addressed
		const devices = await api.device.list();

		should(devices.length > 0).true();

		const device: IDevice = devices[0];
		const deviceUid: IDevice['uid'] = device?.uid;

		if (!device || !deviceUid) {
			return this.skip();
		}

		await api.deviceLocation.assign(deviceUid, createdLocation.uid);
		const deviceWithAssignedLocation = await api.device.get(deviceUid);

		should(deviceWithAssignedLocation.locationUid).be.eql(createdLocation.uid);

		await api.deviceLocation.unassign(deviceUid, createdLocation.uid);
		const deviceWithUnassignedLocation = await api.device.get(deviceUid);

		should(deviceWithUnassignedLocation.locationUid).be.eql(createdLocation.uid);
	}).timeout(ALLOWED_TIMEOUT);
});
