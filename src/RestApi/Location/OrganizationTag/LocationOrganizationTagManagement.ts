import { putResource, deleteResource } from '../../requester';
import { Resources } from '../../resources';
import { Dependencies } from '../../Dependencies';
import { AssignOrganizationTagToLocation, UnassignOrganizationTagFromLocation } from './LocationOrganizationTag';

export default class LocationOrganizationTag {
	constructor(private readonly dependencies: Dependencies) {}

	public async assign(
		locationUid: AssignOrganizationTagToLocation['locationUid'],
		tagUid: AssignOrganizationTagToLocation['tagUid'],
	): Promise<void> {
		await putResource(
			this.dependencies.options,
			`${Resources.Location}/${locationUid}/${Resources.OrganizationTag}/${tagUid}`,
			JSON.stringify({}),
		);
	}

	public async unassign(
		locationUid: UnassignOrganizationTagFromLocation['locationUid'],
		tagUid: UnassignOrganizationTagFromLocation['tagUid'],
	): Promise<void> {
		await deleteResource(this.dependencies.options, `${Resources.Location}/${locationUid}/${Resources.OrganizationTag}/${tagUid}`);
	}
}
