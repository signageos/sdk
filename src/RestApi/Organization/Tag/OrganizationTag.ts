import { fillDataToEntity } from '../../mapper';

export interface IOrganizationTagFilter {
	since?: Date;
	until?: Date;
	limit?: number;
	descending?: boolean;
}

export interface IOrganizationTagCreate {
	name: string;
	organizationUid: string;
	color?: string;
	parentTagUid?: string;
}

export interface IOrganizationTagUpdate {
	name: string;
	color?: string;
	parentTagUid?: string;
}

export interface IOrganizationTag extends IOrganizationTagCreate {
	uid: string;
	createdAt?: Date;
	archivedAt?: Date;
}

export default class OrganizationTag implements IOrganizationTag {
	public readonly uid: IOrganizationTag['uid'];
	public readonly name: IOrganizationTag['name'];
	public readonly organizationUid: IOrganizationTag['organizationUid'];
	public readonly color: IOrganizationTag['color'];
	public readonly parentTagUid: IOrganizationTag['parentTagUid'];
	public readonly createdAt: IOrganizationTag['createdAt'];
	public readonly archivedAt: IOrganizationTag['archivedAt'];

	constructor(data: IOrganizationTag) {
		fillDataToEntity(this, data);
	}
}
