import { getResource, parseJSONResponse, putResource, postResource, deleteResource } from '../requester';
import { Dependencies } from '../Dependencies';
import IOrganization, { IOrganizationCreatable, SubscriptionType } from './IOrganization';
import Organization from './Organization';
import { IOrganizationFilter } from './IOrganizationFilter';
import { omit } from 'lodash';
import CompanyManagement from '../Company/CompanyManagement';
import { OrganizationTokenManagement } from './Token/OrganizationTokenManagement';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

interface OrganizationUpdatableValues {
	title: string;
}

export default class OrganizationManagement {
	public static readonly RESOURCE: string = 'organization';
	public token: OrganizationTokenManagement;

	constructor(private readonly dependencies: Dependencies) {
		this.token = new OrganizationTokenManagement(dependencies);
	}

	public async list(filter: IOrganizationFilter = {}): Promise<PaginatedList<Organization>> {
		const response = filter.companyUid
			? // filtering by company is currently supported only by the /company/:companyUid/organizations endpoint
				await getResource(
					this.dependencies.options,
					CompanyManagement.RESOURCE + '/' + filter.companyUid + '/organizations',
					omit(filter, 'companyUid'),
				)
			: await getResource(this.dependencies.options, OrganizationManagement.RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(
			response,
			(item: IOrganization) => new Organization(item, this.dependencies.options),
		);
	}

	public async get(organizationUid: string, filter: IOrganizationFilter = {}): Promise<Organization> {
		const response = await getResource(this.dependencies.options, OrganizationManagement.RESOURCE + '/' + organizationUid, filter);

		return new Organization(await parseJSONResponse(response), this.dependencies.options);
	}

	public async create(settings: IOrganizationCreatable): Promise<Organization> {
		const { headers } = await postResource(this.dependencies.options, OrganizationManagement.RESOURCE, JSON.stringify(settings));
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
			this.dependencies.options,
			`${OrganizationManagement.RESOURCE}/${organizationUid}/subscriptionType/${subscription}`,
			JSON.stringify({}),
		);
	}

	public async delete(organizationUid: string): Promise<void> {
		await deleteResource(this.dependencies.options, `${OrganizationManagement.RESOURCE}/${organizationUid}`);
	}

	public async update(organizationUid: string, values: OrganizationUpdatableValues): Promise<void> {
		await putResource(this.dependencies.options, `${OrganizationManagement.RESOURCE}/${organizationUid}`, JSON.stringify(values));
	}
}
