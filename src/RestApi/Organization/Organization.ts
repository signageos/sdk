import { fillDataToEntity } from "../mapper";
import IOrganization from "./IOrganization";
import RestApi from "../RestApi";
import IOptions from '../IOptions';

export default class Organization implements IOrganization {

	// public readonly [P in keyof IOrganization]: IOrganization[P]; // Generalized TS doesn't support
	public readonly uid: IOrganization['uid'];
	public readonly name: IOrganization['name'];
	public readonly title: IOrganization['title'];
	public readonly oauthClientId: IOrganization['oauthClientId'];
	public readonly oauthClientSecret: IOrganization['oauthClientSecret'];
	public readonly createdAt: IOrganization['createdAt'];

	constructor(data: IOrganization, private options: IOptions) {
		fillDataToEntity(this, data);
	}

	/** Creates the Api instance with authentication information for the current organization */
	public createApiV1() {
		return new RestApi(this.options, {
			...this.options,
			auth: {
				// TODO the tokens should be used instead of the client id and secret
				clientId: this.oauthClientId,
				secret: this.oauthClientSecret,
			},
		});
	}
}
