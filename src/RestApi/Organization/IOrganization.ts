
export interface IOrganizationCreatable {
	name: string;
	title: string;
}

interface IOrganization extends IOrganizationCreatable {
	uid: string;
	createdAt: Date;
	oauthClientId: string;
	oauthClientSecret: string;
}

export default IOrganization;
