import { deleteResource, putResource } from '../../requester';
import { Resources } from '../../resources';
import { Dependencies } from '../../Dependencies';
import { AssignLocationToDevice, UnassignLocationFromDevice } from './DeviceLocation';

export default class DeviceLocationManagement {
	constructor(private dependencies: Dependencies) {}

	public async assign(deviceUid: AssignLocationToDevice['deviceUid'], locationUid: AssignLocationToDevice['locationUid']): Promise<void> {
		await putResource(
			this.dependencies.options,
			`${Resources.Device}/${deviceUid}/${Resources.Location}/${locationUid}`,
			JSON.stringify({}),
		);
	}

	public async unassign(
		deviceUid: UnassignLocationFromDevice['deviceUid'],
		locationUid: UnassignLocationFromDevice['locationUid'],
	): Promise<void> {
		await deleteResource(this.dependencies.options, `${Resources.Device}/${deviceUid}/${Resources.Location}/${locationUid}`);
	}
}
