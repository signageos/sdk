export interface IContentGuardCategoryFilter {
	readonly descending?: boolean;
	readonly limit?: number;
	readonly uids?: string[];
	readonly companyUid?: string;
	readonly organizationUids?: string[];
	readonly title?: string;
	readonly valid?: boolean;
	readonly sortKey?: 'createdAt';
}
