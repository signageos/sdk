import should from 'should';
import { Api } from '../../../../../src';

import { opts } from '../../helper';
import { IOrganizationTokenCreatable, OrganizationFullToken } from '../../../../../src/RestApi/Organization/Token/OrganizationToken';
import { getOrganizationUid } from '../../../../fixtures/Organization/organization.fixtures';

const api = new Api(opts);

const MAX_API_SECURITY_TOKENS_QUANTITY = 30;

describe('e2e.RestApi.Organization.Token.OrganizationToken', () => {
	let orgUid = getOrganizationUid();

	const organizationTokenCreate: IOrganizationTokenCreatable = { name: 'Test Token' };

	const toDelete: OrganizationFullToken[] = [];

	before(async () => {
		const organizationTokens = await api.organization.token.get(orgUid);

		// Ensure we have enough space for test tokens (keep room for at least 5 new tokens)
		const tokensToDelete = Math.max(0, organizationTokens.length - (MAX_API_SECURITY_TOKENS_QUANTITY - 5));
		
		for (let i = 0; i < tokensToDelete; i++) {
			await api.organization.token.delete(orgUid, organizationTokens[organizationTokens.length - 1 - i].id);
		}
	});

	after(async () => {
		// Clean up tokens created during tests
		for (const orgToken of toDelete) {
			try {
				await api.organization.token.delete(orgUid, orgToken.id);
			} catch (error) {
				// Token may already be deleted, ignore error
				console.warn(`Failed to delete token ${orgToken.id}:`, error instanceof Error ? error.message : String(error));
			}
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

		await api.organization.token.delete(orgUid, token.id);
		const expectedTokenList = beforeTokenList.filter((t) => t.id !== token.id);

		const afterTokenList = await api.organization.token.get(orgUid);

		should(afterTokenList).be.deepEqual(expectedTokenList);
	});
});
