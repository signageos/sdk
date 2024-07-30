import IOptions from '../../IOptions';
import { parseJSONResponse, postResource, deleteResource, getResource } from '../../requester';
import { IOrganizationTokenCreatable, IOrganizationTokenDeletable, OrganizationFullToken, OrganizationToken } from './OrganizationToken';

export class OrganizationTokenManagement {
	constructor(private options: IOptions) {}

	private getUrl(organizationUid: string, tokenId?: string) {
		if (tokenId) {
			return `organization/${organizationUid}/security-token/${tokenId}`;
		}
		return `organization/${organizationUid}/security-token`;
	}

	public async get(organizationUid: string) {
		const response = await getResource(this.options, this.getUrl(organizationUid));
		const data: OrganizationToken[] = await parseJSONResponse(response);
		return data;
	}

	public async create(organizationUid: string, organizationToken: IOrganizationTokenCreatable): Promise<OrganizationFullToken> {
		const response = await postResource(this.options, this.getUrl(organizationUid), JSON.stringify({ name: organizationToken.name }));
		const data: OrganizationFullToken = await parseJSONResponse(response);
		return data;
	}

	public async delete(organizationUid: string, organizationToken: IOrganizationTokenDeletable): Promise<void> {
		await deleteResource(this.options, this.getUrl(organizationUid, organizationToken.securityTokenId));
	}
}
