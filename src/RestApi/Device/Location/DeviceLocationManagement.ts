import { deleteResource, putResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import { AssignLocationToDevice, UnassignLocationFromDevice } from './DeviceLocation';

export default class DeviceLocationManagement {
	constructor(private options: IOptions) {}

	public async assign(
		deviceUid: AssignLocationToDevice['deviceUid'],
		locationUid: AssignLocationToDevice['locationUid'],
	): Promise<void> {
		await putResource(
			this.options,
			`${Resources.Device}/${deviceUid}/${Resources.Location}/${locationUid}`,
			JSON.stringify({}),
		);
	}

	public async unassign(
		deviceUid: UnassignLocationFromDevice['deviceUid'],
		locationUid: UnassignLocationFromDevice['locationUid'],
	): Promise<void> {
		await deleteResource(this.options, `${Resources.Device}/${deviceUid}/${Resources.Location}/${locationUid}`);
	}
}
