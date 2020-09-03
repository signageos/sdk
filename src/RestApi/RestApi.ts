import TimingManagement from './Timing/TimingManagement';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';
import DeviceManagement from "./Device/DeviceManagement";
import AppletManagement from "./Applet/AppletManagement";
import OrganizationManagement from "./Organization/OrganizationManagement";
import FirmwareVersionManagement from "./Firmware/Version/FirmwareVersionManagement";
import CompanyManagement from './Company/CompanyManagement';
import IOptions from './IOptions';

export default class RestApi {

	// Note: We use different authentication here
	public readonly organization: OrganizationManagement = new OrganizationManagement(this.accountOptions);
	public readonly company: CompanyManagement = new CompanyManagement(this.accountOptions);
	public readonly firmwareVersion: FirmwareVersionManagement = new FirmwareVersionManagement(this.accountOptions);

	public readonly timing: TimingManagement = new TimingManagement(this.organizationOptions);
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.organizationOptions);

	public readonly applet: AppletManagement = new AppletManagement(this.organizationOptions);
	public readonly device: DeviceManagement = new DeviceManagement(this.organizationOptions);

	constructor(
		public readonly accountOptions: IOptions,
		public readonly organizationOptions: IOptions,
	) {}
}
