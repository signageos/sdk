import { pick } from 'lodash';

import { getResource, postResource, deleteResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import { IDevicePolicyRaw, IDevicePolicyAssignable } from './IDevicePolicy';
import DevicePolicy from './DevicePolicy';

export default class DevicePolicyManagement {
	public static readonly RESOURCE: string = 'policy';

	constructor(private options: IOptions) {}

	public async list(deviceUid: string) {
		const urlParts = [Resources.Device, deviceUid, DevicePolicyManagement.RESOURCE];
		const response = await getResource(this.options, urlParts.join('/'));
		const data: IDevicePolicyRaw[] = await parseJSONResponse(response);
		return data.map((item: IDevicePolicyRaw) => {
			return new DevicePolicy({ deviceUid, policyUid: item.uid, ...pick(item, ['priority', 'assignedAt']) });
		});
	}

	public async assign(deviceUid: string, settings: IDevicePolicyAssignable) {
		const urlParts = [Resources.Device, deviceUid, DevicePolicyManagement.RESOURCE];
		await postResource(this.options, urlParts.join('/'), JSON.stringify(settings));
	}

	public async unassign(deviceUid: string, policyUid: string) {
		const urlParts = [Resources.Device, deviceUid, DevicePolicyManagement.RESOURCE, policyUid];
		await deleteResource(this.options, urlParts.join('/'));
	}
}
