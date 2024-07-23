import IOptions from '../../IOptions';
import { parseJSONResponse, postResource, deleteResource } from '../../requester';



export interface IOrganizationTokenCreate {
    name: string;
}

export interface IOrganizationTokenResponse {
    id: string;
    securityToken: string;
    name: string;
}

export class OrganizationToken{
	public static readonly RESOURCE: string = 'organization';

    constructor(private options: IOptions) {}

    public async create(orgUid: string, tokenName: string){
        const response = await postResource(this.options, `${OrganizationToken.RESOURCE}/${orgUid}`, JSON.stringify({name: tokenName}));
		const data : IOrganizationTokenResponse = await parseJSONResponse(response);
		return data;
    }

    public async deleteToken(orgUid: string, securityToken: string) {
		await deleteResource(this.options, `${OrganizationToken.RESOURCE}/${orgUid}/security-token/${securityToken}`, JSON.stringify({}));
	}
}