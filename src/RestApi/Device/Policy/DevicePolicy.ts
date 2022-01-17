import { fillDataToEntity } from '../../mapper';
import IDevicePolicy from './IDevicePolicy';

export default class DevicePolicy implements IDevicePolicy {
	public readonly deviceUid: IDevicePolicy['deviceUid'];
	public readonly policyUid: IDevicePolicy['policyUid'];
	public readonly priority: IDevicePolicy['priority'];
	public readonly assignedAt: IDevicePolicy['assignedAt'];

	constructor(data: IDevicePolicy) {
		fillDataToEntity(this, data);
	}
}
