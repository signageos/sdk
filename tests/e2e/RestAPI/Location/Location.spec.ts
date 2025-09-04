import { readFile } from 'fs-extra';
import should from 'should';

import { Api } from '../../../../src';
import Location from '../../../../src/RestApi/Location/Location';
import { getOrganizationUid } from '../../../fixtures/Organization/organization.fixtures';
import { parameters } from '../../../../src/parameters';
import { generateLocationCreatable, generateLocationUpdatable, handleCreateLocation } from '../../../fixtures/Location/location.fixtures';
import { opts } from '../helper';

const api = new Api(opts);

describe('e2e.RestAPI.Location', async () => {
	const toDelete: Location[] = [];

	afterEach(async () => {
		for (const location of toDelete) {
			await api.location.delete(location.uid);
		}
		while (toDelete.length > 0) {
			toDelete.pop();
		}
	});

	it('should create location', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);

		should(createdLocation.uid).not.be.eql(null);
	});

	it('should get one location', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);
		const location = await api.location.get(createdLocation.uid);

		should(location.uid).not.be.eql(null);
	});

	it('should get two locations', async function () {
		const location1 = generateLocationCreatable();
		const location2 = generateLocationCreatable();

		const createdLocation1 = await handleCreateLocation(api, { location: location1, organizationUid: getOrganizationUid() });
		const createdLocation2 = await handleCreateLocation(api, { location: location2, organizationUid: getOrganizationUid() });

		toDelete.push(createdLocation1);
		toDelete.push(createdLocation2);

		const locations = await api.location.list();
		should(locations.find((location) => location.uid === createdLocation1.uid)).not.be.eql(undefined);
		should(locations.find((location) => location.uid === createdLocation2.uid)).not.be.eql(undefined);
	});

	it('should update location', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);
		const locationUpdatePayload = generateLocationUpdatable();

		await api.location.update(createdLocation.uid, locationUpdatePayload);

		const updatedLocation = await api.location.get(createdLocation.uid);
		should(updatedLocation.name).be.eql(locationUpdatePayload.name);
	});

	it('should add attachment', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);
		const attachment = await readFile(`${parameters.paths.rootPath}/tests/assets/image_1.png`);

		await api.location.addAttachment(createdLocation.uid, attachment);
		const location = await api.location.get(createdLocation.uid);

		should(location.attachments.length).be.eql(1);
	});

	it('should remove attachments', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});
		toDelete.push(createdLocation);
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

	it('should delete location', async function () {
		const createdLocation = await handleCreateLocation(api, {
			location: generateLocationCreatable(),
			organizationUid: getOrganizationUid(),
		});

		await api.location.delete(createdLocation.uid);
		await should(api.location.get(createdLocation.uid)).rejectedWith(
			'Request failed with status code 404. Body: {"status":404,"message":"Resource not found - Resource was not found","errorCode":404311,"errorName":"RESOURCE_NOT_FOUND","errorDetail":"Specified resource doesn\'t exist"}',
		);
	});
});
