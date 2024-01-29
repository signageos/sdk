import { putResource, deleteResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import { AssignOrganizationTagToLocation, UnassignOrganizationTagFromLocation } from './LocationOrganizationTag';

export default class LocationOrganizationTag {
	constructor(private options: IOptions) {}

	public async assign(
		locationUid: AssignOrganizationTagToLocation['locationUid'],
		tagUid: AssignOrganizationTagToLocation['tagUid'],
	): Promise<void> {
		await putResource(this.options, `${Resources.Location}/${locationUid}/${Resources.OrganizationTag}/${tagUid}`, JSON.stringify({}));
	}

	public async unassign(
		locationUid: UnassignOrganizationTagFromLocation['locationUid'],
		tagUid: UnassignOrganizationTagFromLocation['tagUid'],
	): Promise<void> {
		await deleteResource(this.options, `${Resources.Location}/${locationUid}/${Resources.OrganizationTag}/${tagUid}`);
	}
}
