export interface IOrganizationFilter {
	/** @deprecated Use uids instead */
	organizationUid?: string;
	uids?: string[];
	accountId?: number;
	name?: string;
	/** Filter organizations only for specific companyUid */
	companyUid?: string;
	limit?: number;
	descending?: boolean;
	createdUntil?: string;
}
