import TimingManagement from './Timing/TimingManagement';
import IOptions from './IOptions';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';
import DeviceManagement from "./Device/DeviceManagement";
import DevicePinManagement from "./Device/Pin/DevicePinManagement";
import DeviceBrightnessManagement from "./Device/Brightness/DeviceBrightnessManagement";
import DevicePackageManagement from "./Device/Package/DevicePackageManagement";
import DeviceVolumeManagement from "./Device/Volume/DeviceVolumeManagement";

export default class RestApi {

	public readonly timing: TimingManagement = new TimingManagement(this.options);
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.options);

	public readonly device: DeviceManagement = new DeviceManagement(this.options);
	public readonly devicePin: DevicePinManagement = new DevicePinManagement(this.options);
	public readonly deviceBrightness: DeviceBrightnessManagement = new DeviceBrightnessManagement(this.options);
	public readonly devicePackage: DevicePackageManagement = new DevicePackageManagement(this.options);
	public readonly deviceVolume: DeviceVolumeManagement = new DeviceVolumeManagement(this.options);

	constructor(
		private options: IOptions
	) {
	}
}
