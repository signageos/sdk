import IOptions from '../../IOptions';
import { parseJSONResponse, postResource, deleteResource } from '../../requester';
import { IOrganizationTokenCreatable, IOrganizationTokenDeletable, OrganizationToken } from './OrganizationToken';

export class OrganizationTokenManagment{
	public static readonly RESOURCE: string = 'organization';

    constructor(private options: IOptions) {}

    public async create(orgUid: string, organizationToken: IOrganizationTokenCreatable) : Promise<OrganizationToken>{
        const response = await postResource(this.options, `${OrganizationTokenManagment.RESOURCE}/${orgUid}`, JSON.stringify({name: organizationToken.name}));
		const data : OrganizationToken = await parseJSONResponse(response);
		return data;
    }

    public async delete(orgUid: string, organizationToken: IOrganizationTokenDeletable) : Promise<void> {
		await deleteResource(this.options, `${OrganizationTokenManagment.RESOURCE}/${orgUid}/security-token/${organizationToken.securityTokenId}`, JSON.stringify({}));
	}
}