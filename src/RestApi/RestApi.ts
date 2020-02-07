import TimingManagement from './Timing/TimingManagement';
import IOptions from './IOptions';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';
import DeviceManagement from "./Device/DeviceManagement";
import AppletManagement from "./Applet/AppletManagement";
import OrganizationManagement from "./Organization/OrganizationManagement";
import FirmwareVersionManagement from "./Firmware/Version/FirmwareVersionManagement";
import CompanyManagement from './Company/CompanyManagement';

export default class RestApi {

	// Note: We use different authentication here
	public readonly organization: OrganizationManagement = new OrganizationManagement(this.accountOptions);
	public readonly company: CompanyManagement = new CompanyManagement(this.accountOptions);
	public readonly firmwareVersion: FirmwareVersionManagement = new FirmwareVersionManagement(this.accountOptions);

	public readonly timing: TimingManagement = new TimingManagement(this.options);
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.options);

	public readonly applet: AppletManagement = new AppletManagement(this.options);
	public readonly device: DeviceManagement = new DeviceManagement(this.options);

	constructor(
		private options: IOptions,
		private accountOptions: IOptions,
	) {
	}
}
