import { fillDataToEntity } from '../../mapper';

export interface IOrganizationTokenCreatable {
	name: string;
}

export interface IOrganizationTokenDeletable {
	securityTokenId: string;
}

export interface IOrganizationToken extends IOrganizationTokenCreatable {
	id: string;
	organizationUid: string;
}

export interface IOrganizationFullToken extends IOrganizationTokenCreatable {
	id: string;
	securityToken: string;
}

export class OrganizationToken implements IOrganizationToken {
	public readonly name: IOrganizationToken['name'];
	public readonly id: IOrganizationToken['id'];
	public readonly organizationUid: IOrganizationToken['organizationUid'];

	constructor(data: IOrganizationToken) {
		fillDataToEntity(this, data);
	}
}

export class OrganizationFullToken implements IOrganizationFullToken {
	public readonly name: IOrganizationFullToken['name'];
	public readonly id: IOrganizationFullToken['id'];
	public readonly securityToken: IOrganizationFullToken['securityToken'];

	constructor(data: IOrganizationFullToken) {
		fillDataToEntity(this, data);
	}
}
