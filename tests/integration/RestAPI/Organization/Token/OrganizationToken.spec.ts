import * as should from 'should';
import { Api } from '../../../../../src';

import { opts } from '../../helper';
import { IOrganizationTokenCreatable, OrganizationToken } from '../../../../../src/RestApi/Organization/Token/OrganizationToken';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';

const api = new Api(opts);

describe('Integration.RestApi.Organization.Token.OrganizationToken', () => {
	let orgUid = getOrganizationUid();

	const organizationTokenCreate: IOrganizationTokenCreatable = { name: 'Test Token' };

	const toDelete: OrganizationToken[] = [];

	before(async () => {
		const organizationTokens = await api.organization.token.get(orgUid);
		if(organizationTokens.length >= 28){
			await api.organization.token.delete(orgUid, {securityTokenId: organizationTokens[organizationTokens.length - 1].id});
		}
	});

	after(async () => {
		for (const orgToken of toDelete) {
			await api.organization.token.delete(orgUid, { securityTokenId: orgToken.id });
		}
	});

	it('should create an organization token', async () => {
		const organizationToken = await api.organization.token.create(orgUid, organizationTokenCreate);
		toDelete.push(organizationToken);
		should(organizationToken.id).not.be.eql(null);
	});

	it('should get an organization token', async () => {
		const organizationTokens = await api.organization.token.get(orgUid);
		should(organizationTokens[0].id).not.be.eql(null);
	});

	it('should delete an organization token', async () => {
		const token = await api.organization.token.create(orgUid, organizationTokenCreate);

		const beforeTokenList = await api.organization.token.get(orgUid);

		await api.organization.token.delete(orgUid, { securityTokenId: token.id });

		const afterTokenList = await api.organization.token.get(orgUid);

		should(beforeTokenList.length).be.greaterThan(afterTokenList.length);
	});
});
