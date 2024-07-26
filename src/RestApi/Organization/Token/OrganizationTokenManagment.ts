import IOptions from '../../IOptions';
import { parseJSONResponse, postResource, deleteResource, getResource } from '../../requester';
import {
	IOrganizationTokenCreatable,
	IOrganizationTokenDeletable,
	OrganizationToken,
	OrganizationTokenResource,
} from './OrganizationToken';

export class OrganizationTokenManagment {
	public static readonly RESOURCE: string = 'organization';

	constructor(private options: IOptions) {}

	public async get(organizationUid: string) {
		const response = await getResource(
			this.options, 
			`${OrganizationTokenManagment.RESOURCE}/${organizationUid}/security-token`
		);
		const data: OrganizationTokenResource[] = await parseJSONResponse(response);
		return data;
	}

	public async create(organizationUid: string, organizationToken: IOrganizationTokenCreatable): Promise<OrganizationToken> {
		const response = await postResource(
			this.options,
			`${OrganizationTokenManagment.RESOURCE}/${organizationUid}/security-token`,
			JSON.stringify({ name: organizationToken.name }),
		);
		const data: OrganizationToken = await parseJSONResponse(response);
		return data;
	}

	public async delete(organizationUid: string, organizationToken: IOrganizationTokenDeletable): Promise<void> {
		await deleteResource(
			this.options,
			`${OrganizationTokenManagment.RESOURCE}/${organizationUid}/security-token/${organizationToken.securityTokenId}`,
		);
	}
}
