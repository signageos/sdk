import IOptions from '../../IOptions';
import { parseJSONResponse, postResource, deleteResource } from '../../requester';



export interface IOrganizationTokenCreate {
    name: string;
}

export interface IOrganizationTokenDelete {
    securityTokenId: string;
}

export interface IOrganizationTokenResponse {
    id: string;
    securityToken: string;
    name: string;
}

export class OrganizationToken{
	public static readonly RESOURCE: string = 'organization';

    constructor(private options: IOptions) {}

    public async create(orgUid: string, params: IOrganizationTokenCreate){
        const response = await postResource(this.options, `${OrganizationToken.RESOURCE}/${orgUid}`, JSON.stringify({name: params.name}));
		const data : IOrganizationTokenResponse = await parseJSONResponse(response);
		return data;
    }

    public async delete(orgUid: string, params: IOrganizationTokenDelete) {
		await deleteResource(this.options, `${OrganizationToken.RESOURCE}/${orgUid}/security-token/${params.securityTokenId}`, JSON.stringify({}));
	}
}