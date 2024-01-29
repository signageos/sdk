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

export type SubscriptionType = 'open' | 'basic' | 'medium' | 'all';

export default IOrganization;
