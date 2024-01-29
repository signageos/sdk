import { getResource, parseJSONResponse, putResource, postResource, deleteResource } from '../requester';
import IOptions from '../IOptions';
import IOrganization, { IOrganizationCreatable, SubscriptionType } from './IOrganization';
import Organization from './Organization';
import { IOrganizationFilter } from './IOrganizationFilter';
import { omit } from 'lodash';
import CompanyManagement from '../Company/CompanyManagement';

interface OrganizationUpdatableValues {
	title: string;
}

export default class OrganizationManagement {
	public static readonly RESOURCE: string = 'organization';

	constructor(private options: IOptions) {}

	public async list(filter: IOrganizationFilter = {}): Promise<IOrganization[]> {
		const response = filter.companyUid
			? // filtering by company is currently supported only by the /company/:companyUid/organizations endpoint
				await getResource(this.options, CompanyManagement.RESOURCE + '/' + filter.companyUid + '/organizations', omit(filter, 'companyUid'))
			: await getResource(this.options, OrganizationManagement.RESOURCE, filter);
		const data: IOrganization[] = await parseJSONResponse(response);

		return data.map((item: IOrganization) => new Organization(item, this.options));
	}

	public async get(orgUid: string, filter: IOrganizationFilter = {}): Promise<Organization> {
		const response = await getResource(this.options, OrganizationManagement.RESOURCE + '/' + orgUid, filter);

		return new Organization(await parseJSONResponse(response), this.options);
	}

	public async create(settings: IOrganizationCreatable): Promise<Organization> {
		const { headers } = await postResource(this.options, OrganizationManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${OrganizationManagement.RESOURCE}.`);
		}

		const locationParts = headerLocation.split('/');
		const organizationUid = locationParts[locationParts.length - 1];
		return await this.get(organizationUid);
	}

	public async setSubscriptionType(organizationUid: string, subscription: SubscriptionType): Promise<void> {
		await putResource(
			this.options,
			`${OrganizationManagement.RESOURCE}/${organizationUid}/subscriptionType/${subscription}`,
			JSON.stringify({}),
		);
	}

	public async delete(organizationUid: string): Promise<void> {
		await deleteResource(this.options, `${OrganizationManagement.RESOURCE}/${organizationUid}`);
	}

	public async update(organizationUid: string, values: OrganizationUpdatableValues): Promise<void> {
		await putResource(this.options, `${OrganizationManagement.RESOURCE}/${organizationUid}`, JSON.stringify(values));
	}
}
