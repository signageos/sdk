import { fillDataToEntity } from '../../mapper';
import IDevicePolicyStatus from './IDevicePolicyStatus';

export default class DevicePolicyStatus implements IDevicePolicyStatus {
	public readonly deviceUid: IDevicePolicyStatus['deviceUid'];
	public readonly policyUid: IDevicePolicyStatus['policyUid'];
	public readonly itemType: IDevicePolicyStatus['itemType'];
	public readonly success: IDevicePolicyStatus['success'];
	public readonly updatedAt: IDevicePolicyStatus['updatedAt'];

	constructor(data: IDevicePolicyStatus) {
		fillDataToEntity(this, data);
	}
}
