import { readFile } from 'fs-extra';
import * as should from 'should';

import { Api } from '../../../../src';
import { ILocation } from '../../../../src/RestApi/Location/Location';
import { getOrganizationUid } from '../../../fixtures/Organization/organization.fixtures';
import { parameters } from '../../../../src/parameters';
import {
	LOCATION_CREATE_1,
	LOCATION_CREATE_2,
	LOCATION_UPDATE_1,
	handleCreateLocation,
} from '../../../fixtures/Location/location.fixtures';
import { opts } from '../helper';

const api = new Api(opts);

describe('Integration.RestAPI.Location', async () => {

	it('should create location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});

		should(createdLocation.uid).not.be.eql(null);
	});

	it('should get one location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});
		const location = await api.location.get(createdLocation.uid);

		should(location.uid).not.be.eql(null);
	});

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
	});

	it('should update location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});
		const locationUpdatePayload = LOCATION_UPDATE_1;

		await api.location.update(createdLocation.uid, locationUpdatePayload);

		const updatedLocation = await api.location.get(createdLocation.uid);

		should(updatedLocation.name).be.eql(LOCATION_UPDATE_1.name);
	});

	it('should add attachment', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});
		const attachment = await readFile(`${parameters.paths.rootPath}/tests/assets/image_1.png`);

		await api.location.addAttachment(createdLocation.uid, attachment);
		const location = await api.location.get(createdLocation.uid);

		should(location.attachments.length).be.eql(1);
	});

	it('should remove attachments', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});
		const attachment1 = await readFile(`${parameters.paths.rootPath}/tests/assets/image_1.png`);
		const attachment2 = await readFile(`${parameters.paths.rootPath}/tests/assets/image_2.jpeg`);

		await api.location.addAttachment(createdLocation.uid, attachment1);
		await api.location.addAttachment(createdLocation.uid, attachment2);
		const locationWithAddedAttachments = await api.location.get(createdLocation.uid);

		should(locationWithAddedAttachments.attachments.length).be.eql(2);

		await api.location.removeAttachments(createdLocation.uid, locationWithAddedAttachments.attachments);
		const locationWithRemovedAttachments = await api.location.get(createdLocation.uid);

		should(locationWithRemovedAttachments.attachments.length).be.eql(0);
	});

	it('should delete location', async () => {
		const createdLocation = await handleCreateLocation(api, {
			location: LOCATION_CREATE_1,
			organizationUid: getOrganizationUid(),
		});

		await api.location.delete(createdLocation.uid);
		const response = await api.location.get(createdLocation.uid);

		should(response.archivedAt instanceof Date).be.eql(true);
	});
});
