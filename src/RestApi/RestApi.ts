import TimingManagement from './Timing/TimingManagement';
import IOptions from './IOptions';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';
import DeviceManagement from "./Device/DeviceManagement";
import DevicePinManagement from "./Device/Pin/DevicePinManagement";

export default class RestApi {

	public readonly timing: TimingManagement = new TimingManagement(this.options);
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.options);

	public readonly device: DeviceManagement = new DeviceManagement(this.options);
	public readonly devicePin: DevicePinManagement = new DevicePinManagement(this.options);

	constructor(
		private options: IOptions
	) {
	}
}
