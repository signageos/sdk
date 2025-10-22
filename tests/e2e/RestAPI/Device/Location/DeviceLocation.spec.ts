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
	let testDevice: IDevice;

	before('create test device', async function () {
		testDevice = await api.emulator.create({ organizationUid: opts.organizationUid! });
	});

	after('remove location and device', async function () {
		for (const location of toDelete) {
			await api.location.delete(location.uid);
		}
		if (testDevice) {
			await api.emulator.delete(testDevice.uid);
		}
	});

	it('should assign and unassign location to and from device', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);

		const deviceUid: IDevice['uid'] = testDevice.uid;

		await api.deviceLocation.assign(deviceUid, createdLocation.uid);
		const deviceWithAssignedLocation = await api.device.get(deviceUid);

		should(deviceWithAssignedLocation.locationUid).be.eql(createdLocation.uid);

		await api.deviceLocation.unassign(deviceUid, createdLocation.uid);
		const deviceWithUnassignedLocation = await api.device.get(deviceUid);

		should(deviceWithUnassignedLocation.locationUid).be.null();
	});
});
