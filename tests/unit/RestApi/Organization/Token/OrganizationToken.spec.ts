import nock from 'nock';
import should from 'should';

import { ApiVersions } from '../../../../../src/RestApi/apiVersions';
import {
	ORGANIZATION_TOKEN_1,
	ORGANIZATION_TOKEN_CREATE_1,
	ORGANIZATION_TOKEN_DELETE_1,
	ORGANIZATION_TOKEN_GET_1,
	ORGANIZATION_UID,
} from './OrganizationToken.fixtures';
import { getNockOpts, nockAuthHeader1 } from '../../helper';
import { IOrganizationFullToken, OrganizationToken } from '../../../../../src/RestApi/Organization/Token/OrganizationToken';
import { OrganizationTokenManagement } from '../../../../../src/RestApi/Organization/Token/OrganizationTokenManagement';
import { createDependencies } from '../../../../../src/RestApi/Dependencies';

const nockOpts = getNockOpts({});
const organizationTokenManagement = new OrganizationTokenManagement(createDependencies(nockOpts));

const postRespHeaders: nock.ReplyHeaders = {
	Location: `https://example.com/${ApiVersions.V1}/organization/${ORGANIZATION_UID}`,
};

const assertOrganizationToken = (organizationToken: IOrganizationFullToken) => {
	const { id, name, securityToken } = organizationToken;

	should(id).be.equal(ORGANIZATION_TOKEN_1.id);
	should(name).be.equal(ORGANIZATION_TOKEN_1.name);
	should(securityToken).be.equal(ORGANIZATION_TOKEN_1.securityToken);
};

const assertOrganizationTokenList = (organizationTokenList: OrganizationToken[]) => {
	const { id, name, organizationUid } = organizationTokenList[0];

	should(id).be.equal(ORGANIZATION_TOKEN_GET_1[0].id);
	should(name).be.equal(ORGANIZATION_TOKEN_GET_1[0].name);
	should(organizationUid).be.equal(ORGANIZATION_TOKEN_GET_1[0].organizationUid);
};

describe('Unit.RestApi.Organization.Token.OrganizationToken', () => {
	it('should get organization tokens', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.get(`/${ApiVersions.V1}/organization/${ORGANIZATION_UID}/security-token`)
			.reply(200, ORGANIZATION_TOKEN_GET_1, postRespHeaders);

		const organizationTokens = await organizationTokenManagement.get(ORGANIZATION_UID);

		assertOrganizationTokenList(organizationTokens);
	});

	it('should create organization token', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.post(`/${ApiVersions.V1}/organization/${ORGANIZATION_UID}/security-token`, JSON.stringify(ORGANIZATION_TOKEN_CREATE_1))
			.reply(201, ORGANIZATION_TOKEN_1, postRespHeaders);

		const organizationToken = await organizationTokenManagement.create(ORGANIZATION_UID, ORGANIZATION_TOKEN_CREATE_1);

		assertOrganizationToken(organizationToken);
	});

	it('should delete organization token', async () => {
		nock(nockOpts.url, nockAuthHeader1)
			.delete(`/${ApiVersions.V1}/organization/${ORGANIZATION_UID}/security-token/${ORGANIZATION_TOKEN_DELETE_1}`)
			.reply(200);

		await should(organizationTokenManagement.delete(ORGANIZATION_UID, ORGANIZATION_TOKEN_DELETE_1)).be.fulfilled();
	});
});
