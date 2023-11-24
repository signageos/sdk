import * as should from 'should';
import { Api } from '../../../../../src';
import { generateOrganizationTagCreate, generateOrganizationTagUpdate } from '../../../../fixtures/Organization/Tag/organizationTag.fixtures';
import { opts } from '../../helper';

const api = new Api(opts);

describe('Integration.RestAPI.Organization.Tag.OrganizationTag', async () => {

	it('should create organization tag', async () => {
		const organizationTag = await api.organizationTag.create(generateOrganizationTagCreate());

		should(organizationTag.uid).not.be.eql(null);
	});

	it('should get one organization tag', async () => {
		const createdOrganizationTag = await api.organizationTag.create(generateOrganizationTagCreate());
		const organizationTag = await api.organizationTag.getOne(createdOrganizationTag.uid);

		should(organizationTag.uid).not.be.eql(null);
	});

	it('should update organization tag', async () => {
		const createdOrganizationTag = await api.organizationTag.create(generateOrganizationTagCreate());

		const tagUpdate = generateOrganizationTagUpdate();
		await api.organizationTag.update(createdOrganizationTag.uid, tagUpdate);

		const updateUpdatedOrganizationTag = await api.organizationTag.getOne(createdOrganizationTag.uid);

		should(updateUpdatedOrganizationTag.name).be.eql(tagUpdate.name);
	});

	it('should delete organization tag', async () => {
		const createdOrganizationTag = await api.organizationTag.create(generateOrganizationTagCreate());
		await api.organizationTag.delete(createdOrganizationTag.uid);
		await should(api.organizationTag.getOne(createdOrganizationTag.uid)).rejectedWith(/Organization tag not found/);
	});
});
