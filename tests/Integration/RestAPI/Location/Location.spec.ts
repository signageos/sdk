import * as should from 'should';

import { Api } from '../../../../src';
import { ILocation } from '../../../../src/RestApi/Location/Location';
import { opts, ALLOWED_TIMEOUT, preRunCheck, getOrganizationUid } from '../helper';
import { LOCATION_CREATE_1, LOCATION_CREATE_2, LOCATION_UPDATE_1 } from './Location.fixtures';
import { handleCreateLocation } from './Location.utils';

const api = new Api(opts);

describe('Integration.RestAPI.Location', async () => {
	before(function () {
		preRunCheck(this.skip.bind(this));
	});

	it('should create location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});

		should(createdLocation.uid).not.be.eql(null);
	}).timeout(ALLOWED_TIMEOUT);

	it('should get one location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});
		const location = await api.location.get(createdLocation.uid);

		should(location.uid).not.be.eql(null);
	}).timeout(ALLOWED_TIMEOUT);

	it('should get two locations', async () => {
		const expectedNames = [LOCATION_CREATE_1.name, LOCATION_CREATE_2.name];

		[LOCATION_CREATE_1, LOCATION_CREATE_2].forEach(async (location) => {
			await handleCreateLocation(api, { location, organizationUid: getOrganizationUid() });
		});

		const locations = await api.location.list();

		expectedNames.forEach((expectedName) => {
			const location = locations.find(({ name }) => name === expectedName) as ILocation;

			should(location.name).be.eql(expectedName);
		});
	}).timeout(ALLOWED_TIMEOUT);

	it('should update location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});
		const locationUpdatePayload = LOCATION_UPDATE_1;

		await api.location.update(createdLocation.uid, locationUpdatePayload);

		const updatedLocation = await api.location.get(createdLocation.uid);

		should(updatedLocation.name).be.eql(LOCATION_UPDATE_1.name);
	}).timeout(ALLOWED_TIMEOUT);

	it('should delete location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});

		try {
			await api.location.delete(createdLocation.uid);
			const response = await api.location.get(createdLocation.uid);

			should(response.uid).not.be.equal(createdLocation.uid);
		} catch (err) {
			should(err.errorCode).be.equal(404141);
		}
	}).timeout(ALLOWED_TIMEOUT);
});
