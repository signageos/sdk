import should from 'should';

import { Api } from '../../../../../src';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';
import { generateOrganizationTagCreate } from '../../../../fixtures/Organization/Tag/organizationTag.fixtures';
import { generateLocationCreatable, handleCreateLocation } from '../../../../fixtures/Location/location.fixtures';
import { opts } from '../../helper';
import Location from '../../../../../src/RestApi/Location/Location';

const api = new Api(opts);

describe('e2e.RestAPI.Device.Location.Tag.LocationOrganizationTag', async () => {
	const toDelete: Location[] = [];

	after('remove location', async function () {
		for (const location of toDelete) {
			await api.location.delete(location.uid);
		}
	});

	it('should assign and unassign organization tag to and from location', async function () {
		const createdLocation1 = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation1);

		const organizationTag1 = await api.organizationTag.create(generateOrganizationTagCreate());
		const organizationTag2 = await api.organizationTag.create(generateOrganizationTagCreate());

		await api.locationOrganizationTag.assign(createdLocation1.uid, organizationTag1.uid);
		const locationWithOrganizationTag1 = await api.location.get(createdLocation1.uid);

		should(locationWithOrganizationTag1.tagUids).be.deepEqual([organizationTag1.uid]);

		await api.locationOrganizationTag.assign(createdLocation1.uid, organizationTag2.uid);
		const locationWithOrganizationTag2 = await api.location.get(createdLocation1.uid);

		should(locationWithOrganizationTag2.tagUids).be.deepEqual([organizationTag1.uid, organizationTag2.uid]);

		await api.locationOrganizationTag.unassign(createdLocation1.uid, organizationTag1.uid);
		const locationWithOrganizationTag3 = await api.location.get(createdLocation1.uid);

		should(locationWithOrganizationTag3.tagUids).be.deepEqual([organizationTag2.uid]);

		await api.locationOrganizationTag.unassign(createdLocation1.uid, organizationTag2.uid);
		const locationWithOrganizationTag4 = await api.location.get(createdLocation1.uid);

		should(locationWithOrganizationTag4.tagUids).be.deepEqual([]);
	});
});
