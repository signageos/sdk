import * as should from 'should';
import { isDate } from 'lodash';

import { Api } from '../../../../../src';
import OrganizationTag from '../../../../../src/RestApi/Organization/Tag/OrganizationTag';
import {
	ORGANIZATION_TAG_CREATE_1,
	ORGANIZATION_TAG_UPDATE_1,
	ORGANIZATION_TAG_DELETE_1,
} from '../../../../fixtures/Organization/Tag/organizationTag.fixtures';
import { opts } from '../../helper';

const api = new Api(opts);

describe('Integration.RestAPI.Organization.Tag.OrganizationTag', async () => {

	it('should create organization tag', async () => {
		const organizationTag = await api.organizationTag.create(ORGANIZATION_TAG_CREATE_1);

		should(organizationTag.uid).not.be.eql(null);
	});

	it('should get one organization tag', async () => {
		const createdOrganizationTag = await api.organizationTag.create(ORGANIZATION_TAG_CREATE_1);
		const organizationTag = await api.organizationTag.getOne(createdOrganizationTag.uid);

		should(organizationTag.uid).not.be.eql(null);
	});

	it('should update organization tag', async () => {
		const createdOrganizationTag = await api.organizationTag.create(ORGANIZATION_TAG_CREATE_1);

		await api.organizationTag.update(createdOrganizationTag.uid, ORGANIZATION_TAG_UPDATE_1);

		const updateUpdatedOrganizationTag = await api.organizationTag.getOne(createdOrganizationTag.uid);

		should(updateUpdatedOrganizationTag.name).be.eql(ORGANIZATION_TAG_UPDATE_1.name);
	});

	it('should delete organization tag', async () => {
		const createdOrganizationTag = await api.organizationTag.create(ORGANIZATION_TAG_DELETE_1);
		let response: OrganizationTag | undefined = undefined;

		try {
			await api.organizationTag.delete(createdOrganizationTag.uid);
			response = await api.organizationTag.getOne(createdOrganizationTag.uid);

			should(isDate(response?.archivedAt)).be.equal(false);
		} catch (err) {
			should(isDate(response?.archivedAt)).be.eql(true);
		}
	});
});