import { getResource, parseJSONResponse, putResource } from '../requester';
import IOptions from "../IOptions";
import IOrganization, { IOrganizationCreatable, SubscriptionType } from './IOrganization';
import {postResource} from "../requester";
import Organization from "./Organization";
import {IOrganizationFilter} from "./IOrganizationFilter";

export default class OrganizationManagement {

	public static readonly RESOURCE: string = 'organization';

	constructor(private options: IOptions) {
	}

	public async list(filter: IOrganizationFilter = {}): Promise<IOrganization[]> {
		const response = await getResource(this.options, OrganizationManagement.RESOURCE, filter);
		const data: IOrganization[] = await parseJSONResponse(response);

		return data.map((item: IOrganization) => new Organization(item));
	}

	public async get(orgUid: string, filter: IOrganizationFilter = {}): Promise<IOrganization> {
		const response = await getResource(this.options, OrganizationManagement.RESOURCE + '/' + orgUid, filter);

		return new Organization(await parseJSONResponse(response));
	}

	public async create(settings: IOrganizationCreatable): Promise<void> {
		await postResource(this.options, OrganizationManagement.RESOURCE, JSON.stringify(settings));
	}

	public async setSubscriptionType(organizationUid: string, subscription: SubscriptionType): Promise<void> {
		await putResource(
			this.options,
			`${OrganizationManagement.RESOURCE}/${organizationUid}/subscriptionType/${subscription}`,
			JSON.stringify({}),
		);
	}

}
