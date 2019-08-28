import {getResource, parseJSONResponse} from "../requester";
import IOptions from "../IOptions";
import IOrganization, {IOrganizationCreatable} from "./IOrganization";
import {postResource} from "../requester";
import Organization from "./Organization";
import {IOrganizationFilter} from "./IOrganizationFilter";

export default class OrganizationManagement {

	public static readonly RESOURCE: string = 'organization';

	constructor(private options: IOptions) {
	}

	public async get(orgUid: string, filter: IOrganizationFilter = {}): Promise<IOrganization> {
		const response = await getResource(this.options, OrganizationManagement.RESOURCE + '/' + orgUid, filter);

		return new Organization(await parseJSONResponse(response));
	}

	public async create(settings: IOrganizationCreatable): Promise<void> {
		await postResource(this.options, OrganizationManagement.RESOURCE, settings);
	}

}
