import { fillDataToEntity } from "../mapper";
import IOrganization from "./IOrganization";

export default class Organization implements IOrganization {

	// public readonly [P in keyof IOrganization]: IOrganization[P]; // Generalized TS doesn't support
	public readonly uid: IOrganization['uid'];
	public readonly name: IOrganization['name'];
	public readonly title: IOrganization['title'];
	public readonly oauthClientId: IOrganization['oauthClientId'];
	public readonly oauthClientSecret: IOrganization['oauthClientSecret'];
	public readonly createdAt: IOrganization['createdAt'];

	constructor(data: IOrganization) {
		fillDataToEntity(this, data);
	}
}
