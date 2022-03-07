import IOptions from '../../IOptions';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import { Resources } from '../../resources';
import OrganizationTag, { IOrganizationTagCreate, IOrganizationTag, IOrganizationTagUpdate } from './OrganizationTag';

export default class OrganizationTagManagement {
	constructor(private options: IOptions) {}

	public async getOne(uid: IOrganizationTag['uid']) {
		const response = await getResource(this.options, `${Resources.OrganizationTag}/${uid}`);

		return new OrganizationTag(await parseJSONResponse(response));
	}

	public async create(organizationTag: IOrganizationTagCreate) {
		const { headers } = await postResource(
			this.options,
			Resources.OrganizationTag,
			JSON.stringify(organizationTag),
		);
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`API didn't return location header to created ${Resources.OrganizationTag}.`);
		}

		const locationSegments = headerLocation.split('/');
		const organizationTagUid = locationSegments[locationSegments.length - 1];

		return await this.getOne(organizationTagUid);
	}

	public async update(uid: IOrganizationTag['uid'], organizationTag: IOrganizationTagUpdate) {
		await putResource(this.options, `${Resources.OrganizationTag}/${uid}`, JSON.stringify(organizationTag));
	}

	public async delete(uid: IOrganizationTag['uid']) {
		await deleteResource(this.options, `${Resources.OrganizationTag}/${uid}`);
	}
}
