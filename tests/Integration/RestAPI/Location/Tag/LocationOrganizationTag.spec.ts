import * as should from 'should';

import { Api } from '../../../../../src';
import { opts, ALLOWED_TIMEOUT, preRunCheck, getOrganizationUid } from '../../helper';
import { ORGANIZATION_TAG_CREATE_1, ORGANIZATION_TAG_CREATE_2 } from '../../Organization/Tag/OrganizationTag.fixtures';
import { LOCATION_CREATE_1, handleCreateLocation } from '../Location.fixtures';

const api = new Api(opts);

describe('Integration.RestAPI.Device.Location.Tag.LocationOrganizationTag', async () => {
	before(function () {
		preRunCheck(this.skip.bind(this));
	});

	it('should assign and unassign organization tag to and from location', async function () {
		const createdLocation1 = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});

		const organizationTag1 = await api.organizationTag.create(ORGANIZATION_TAG_CREATE_1);
		const organizationTag2 = await api.organizationTag.create(ORGANIZATION_TAG_CREATE_2);

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
	}).timeout(ALLOWED_TIMEOUT);
});
