import { getResource, parseJSONResponse, putResource } from '../requester';
import IOptions from '../IOptions';
import { IOrganizationFilter } from '../Organization/IOrganizationFilter';
import IOrganization from '../Organization/IOrganization';
import Organization from '../Organization/Organization';

export interface ICompany extends IOrganization {}

export class Company extends Organization implements ICompany {}

export interface ICompanyFilter extends IOrganizationFilter {}

export type BillingPlan = 'open' | 'medium' | 'enterprise';

export default class CompanyManagement {
	public static readonly RESOURCE: string = 'company';

	constructor(private options: IOptions) {}

	public async list(filter: ICompanyFilter = {}): Promise<ICompany[]> {
		const response = await getResource(this.options, CompanyManagement.RESOURCE, filter);
		const data: IOrganization[] = await parseJSONResponse(response);

		return data.map((item: IOrganization) => new Company(item, this.options));
	}

	public async get(companyUid: string, filter: ICompanyFilter = {}): Promise<IOrganization> {
		const response = await getResource(this.options, CompanyManagement.RESOURCE + '/' + companyUid, filter);

		return new Company(await parseJSONResponse(response), this.options);
	}

	public async setBillingPlan(companyUid: string, billingPlan: BillingPlan): Promise<void> {
		await putResource(this.options, `${CompanyManagement.RESOURCE}/${companyUid}/billingPlan/${billingPlan}`, JSON.stringify({}));
	}
}
