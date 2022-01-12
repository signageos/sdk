import { fillDataToEntity } from "../../mapper";
import IDeviceTelemetry from './IDeviceTelemetry';

export default class DeviceTelemetry implements IDeviceTelemetry {
	public readonly deviceUid: IDeviceTelemetry['deviceUid'];
	public readonly type: IDeviceTelemetry['type'];
	public readonly updatedAt: IDeviceTelemetry['updatedAt'];
	public readonly data: IDeviceTelemetry['data'];

	constructor(data: IDeviceTelemetry) {
		fillDataToEntity(this, data);
	}
}
