import nock from 'nock';
import should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import OrganizationTagManagement from '../../../../../src/RestApi/Organization/Tag/OrganizationTagManagement';
import IOrganizationTag from '../../../../../src/RestApi/Organization/Tag/OrganizationTag';
import { Resources } from '../../../../../src/RestApi/resources';
import { ORGANIZATION_TAG_1, ORGANIZATION_TAG_UPDATE_1 } from './OrganizationTag.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';

const nockOpts = getNockOpts({});
const organizationTagManagement = new OrganizationTagManagement(nockOpts);

const postRespHeaders: nock.ReplyHeaders = {
	Location: `https://example.com/${ApiVersions.V1}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`,
};

const assertOrganizationTag = (organizationTag: IOrganizationTag) => {
	const { uid, name, organizationUid } = organizationTag;

	should(uid).be.equal(ORGANIZATION_TAG_1.uid);
	should(name).be.equal(ORGANIZATION_TAG_1.name);
	should(organizationUid).be.equal(ORGANIZATION_TAG_1.organizationUid);
};

describe('Unit.RestApi.Organization.Tag.OrganizationTag', () => {
	it('should create organization tag', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.post(`/${ApiVersions.V1}/${Resources.OrganizationTag}`, JSON.stringify(ORGANIZATION_TAG_1))
			.reply(200, 'Created', postRespHeaders)
			.get(`/${ApiVersions.V1}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`)
			.reply(200, ORGANIZATION_TAG_1);

		const organizationTag = await organizationTagManagement.create(ORGANIZATION_TAG_1);

		assertOrganizationTag(organizationTag);
	});

	it('should get one organization tag', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.get(`/${ApiVersions.V1}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`)
			.reply(200, ORGANIZATION_TAG_1);

		const organizationTag = await organizationTagManagement.getOne(ORGANIZATION_TAG_1.uid);

		assertOrganizationTag(organizationTag);
	});

	it('should update organization tag', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.put(`/${ApiVersions.V1}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`)
			.reply(200, ORGANIZATION_TAG_1);

		await should(organizationTagManagement.update(ORGANIZATION_TAG_1.uid, ORGANIZATION_TAG_UPDATE_1)).be.fulfilled();
	});

	it('should delete organization tag', async () => {
		nock(nockOpts.url, nockAuthHeader1).delete(`/${ApiVersions.V1}/${Resources.OrganizationTag}/${ORGANIZATION_TAG_1.uid}`).reply(200);

		await should(organizationTagManagement.delete(ORGANIZATION_TAG_1.uid)).be.fulfilled();
	});
});
