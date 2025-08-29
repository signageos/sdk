import should from 'should';

import Location from '../../../../../src/RestApi/Location/Location';
import { Api } from '../../../../../src';
import IDevice from '../../../../../src/RestApi/Device/IDevice';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';
import { generateLocationCreatable, handleCreateLocation } from '../../../../fixtures/Location/location.fixtures';
import { opts } from '../../helper';

const api = new Api(opts);

describe('e2e.RestAPI.Device.Location.DeviceLocation', async () => {
	const toDelete: Location[] = [];

	after('remove location', async function () {
		for (const location of toDelete) {
			await api.location.delete(location.uid);
		}
	});

	it('should assign and unassign location to and from device', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);

		// TODO: This approach is taken from the Device, since there is no create method. This should be addressed
		const devices = await api.device.list();

		should(devices.length > 0).true();

		const device: IDevice = devices[0];
		const deviceUid: IDevice['uid'] = device?.uid;

		await api.deviceLocation.assign(deviceUid, createdLocation.uid);
		const deviceWithAssignedLocation = await api.device.get(deviceUid);

		should(deviceWithAssignedLocation.locationUid).be.eql(createdLocation.uid);

		await api.deviceLocation.unassign(deviceUid, createdLocation.uid);
		const deviceWithUnassignedLocation = await api.device.get(deviceUid);

		should(deviceWithUnassignedLocation.locationUid).be.null();
	});
});
