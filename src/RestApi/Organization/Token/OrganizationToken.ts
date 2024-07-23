import { fillDataToEntity } from '../../mapper';

export interface IOrganizationTokenCreatable {
    name: string;
}

export interface IOrganizationTokenDeletable {
    securityTokenId: string;
}

export interface IOrganizationToken extends IOrganizationTokenCreatable {
    id: string;
    securityToken: string;
}

export class OrganizationToken implements IOrganizationToken{
    public readonly name: IOrganizationToken['name'];
    public readonly id: IOrganizationToken['id'];
    public readonly securityToken: IOrganizationToken['securityToken'];

    constructor(data: IOrganizationToken) {
        fillDataToEntity(this, data);
    }
}