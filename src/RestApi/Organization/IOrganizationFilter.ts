export interface IOrganizationFilter {
	organizationUid?: string;
	accountId?: number;
	name?: string;
	/** Filter organizations only for specific companyUid */
	companyUid?: string;
}
