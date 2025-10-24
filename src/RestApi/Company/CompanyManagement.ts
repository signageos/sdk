import { getResource, parseJSONResponse, putResource } from '../requester';
import { IOrganizationFilter } from '../Organization/IOrganizationFilter';
import IOrganization from '../Organization/IOrganization';
import Organization from '../Organization/Organization';
import { Dependencies } from '../Dependencies';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

export type ICompany = IOrganization;

export class Company extends Organization implements ICompany {}

export type ICompanyFilter = IOrganizationFilter;

export type BillingPlan = 'open' | 'medium' | 'enterprise';

export default class CompanyManagement {
	public static readonly RESOURCE: string = 'company';

	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter: ICompanyFilter = {}): Promise<PaginatedList<Company>> {
		const response = await getResource(this.dependencies.options, CompanyManagement.RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(
			response,
			(item: IOrganization) => new Company(item, this.dependencies.options),
		);
	}

	public async get(companyUid: string, filter: ICompanyFilter = {}): Promise<IOrganization> {
		const response = await getResource(this.dependencies.options, CompanyManagement.RESOURCE + '/' + companyUid, filter);

		return new Company(await parseJSONResponse(response), this.dependencies.options);
	}

	public async setBillingPlan(companyUid: string, billingPlan: BillingPlan): Promise<void> {
		await putResource(
			this.dependencies.options,
			`${CompanyManagement.RESOURCE}/${companyUid}/billingPlan/${billingPlan}`,
			JSON.stringify({}),
		);
	}
}
