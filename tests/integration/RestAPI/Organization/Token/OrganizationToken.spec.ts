import * as should from 'should';
import { Api } from '../../../../../src';

import { opts } from '../../helper';
import { IOrganizationTokenCreatable, OrganizationFullToken } from '../../../../../src/RestApi/Organization/Token/OrganizationToken';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';

const api = new Api(opts);

describe('Integration.RestApi.Organization.Token.OrganizationToken', () => {
	let orgUid = getOrganizationUid();

	const organizationTokenCreate: IOrganizationTokenCreatable = { name: 'Test Token' };

	const toDelete: OrganizationFullToken[] = [];

	before(async () => {
		const organizationTokens = await api.organization.token.get(orgUid);

		if (organizationTokens.length === 30) {
			await api.organization.token.delete(orgUid, { securityTokenId: organizationTokens[organizationTokens.length - 1].id });
			await api.organization.token.delete(orgUid, { securityTokenId: organizationTokens[organizationTokens.length - 2].id });
		}
	});

	after(async () => {
		for (const orgToken of toDelete) {
			await api.organization.token.delete(orgUid, { securityTokenId: orgToken.id });
		}
	});

	it('should create an organization token', async () => {
		const organizationToken = await api.organization.token.create(orgUid, organizationTokenCreate);
		should(organizationToken.id).not.be.eql(null);
		toDelete.push(organizationToken);
	});

	it('should get an organization token', async () => {
		const organizationTokens = await api.organization.token.get(orgUid);
		should(organizationTokens[0].id).not.be.eql(null);
	});

	it('should delete an organization token', async () => {
		const token = await api.organization.token.create(orgUid, organizationTokenCreate);

		const beforeTokenList = await api.organization.token.get(orgUid);

		await api.organization.token.delete(orgUid, { securityTokenId: token.id });
		const expectedTokenList = beforeTokenList.filter((t) => t.id !== token.id);

		const afterTokenList = await api.organization.token.get(orgUid);

		should(afterTokenList).be.deepEqual(expectedTokenList);
	});
});
