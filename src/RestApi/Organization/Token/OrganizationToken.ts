import { fillDataToEntity } from '../../mapper';

export interface IOrganizationTokenCreatable {
	name: string;
}

export interface IOrganizationTokenDeletable {
	securityTokenId: string;
}

export interface IOrganizationTokenResource extends IOrganizationTokenCreatable {
	id: string;
	organizationUid: string;
}

export interface IOrganizationToken extends IOrganizationTokenCreatable {
	id: string;
	securityToken: string;
}

export class OrganizationTokenResource implements IOrganizationTokenResource {
	public readonly name: IOrganizationTokenResource['name'];
	public readonly id: IOrganizationTokenResource['id'];
	public readonly organizationUid: IOrganizationTokenResource['organizationUid'];
}

export class OrganizationToken implements IOrganizationToken {
	public readonly name: IOrganizationToken['name'];
	public readonly id: IOrganizationToken['id'];
	public readonly securityToken: IOrganizationToken['securityToken'];

	constructor(data: IOrganizationToken) {
		fillDataToEntity(this, data);
	}
}
