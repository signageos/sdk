import { Dependencies } from '../../Dependencies';
import { parseJSONResponse, postResource, deleteResource, getResource } from '../../requester';
import { IOrganizationTokenCreatable, OrganizationFullToken, OrganizationToken } from './OrganizationToken';

export class OrganizationTokenManagement {
	constructor(private readonly dependencies: Dependencies) {}

	public async get(organizationUid: string) {
		const response = await getResource(this.dependencies.options, this.getUrl(organizationUid));
		const data: OrganizationToken[] = await parseJSONResponse(response);
		return data.map((item) => new OrganizationToken(item));
	}

	public async create(organizationUid: string, organizationToken: IOrganizationTokenCreatable): Promise<OrganizationFullToken> {
		const response = await postResource(
			this.dependencies.options,
			this.getUrl(organizationUid),
			JSON.stringify({ name: organizationToken.name }),
		);
		const data: OrganizationFullToken = await parseJSONResponse(response);
		return new OrganizationFullToken(data);
	}

	public async delete(organizationUid: string, tokenId: string): Promise<void> {
		await deleteResource(this.dependencies.options, this.getUrl(organizationUid, tokenId));
	}

	private getUrl(organizationUid: string, tokenId?: string) {
		if (tokenId) {
			return `organization/${organizationUid}/security-token/${tokenId}`;
		}
		return `organization/${organizationUid}/security-token`;
	}
}
