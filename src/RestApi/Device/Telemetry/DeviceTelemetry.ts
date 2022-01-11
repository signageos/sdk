import { fillDataToEntity } from "../../mapper";
import IDeviceTelemetry from './IDeviceTelemetry';

export default class DeviceTelemetry implements IDeviceTelemetry {
	public readonly updatedAt: IDeviceTelemetry['updatedAt'];
	public readonly data: IDeviceTelemetry['data'];

	constructor(data: IDeviceTelemetry) {
		fillDataToEntity(this, data);
	}
}
