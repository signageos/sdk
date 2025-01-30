import OrganizationManagement from './Organization/OrganizationManagement';
import OrganizationTagManagement from './Organization/Tag/OrganizationTagManagement';
import TimingManagement from './Timing/TimingManagement';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';
import DeviceManagement from './Device/DeviceManagement';
import DeviceAliveManagement from './Device/Alive/DeviceAliveManagement';
import AppletManagement from './Applet/AppletManagement';
import PolicyManagement from './Policy/PolicyManagement';
import BulkOperationManagement from './BulkOperation/BulkOperationManagement';
import EmulatorManagement from './Emulator/EmulatorManagement';
import FirmwareVersionManagement from './Firmware/Version/FirmwareVersionManagement';
import CompanyManagement from './Company/CompanyManagement';
import LocationManagement from './Location/LocationManagement';
import LocationOrganizationTag from './Location/OrganizationTag/LocationOrganizationTagManagement';
import DeviceLocationManagement from './Device/Location/DeviceLocationManagement';
import AlertManagement from './Alerts/AlertManagement';
import IOptions from './IOptions';
import PackageManagement from './Package/PackageManagement';
import { Paginator } from '../Lib/Pagination/paginator';
import { CustomScriptManagement } from './CustomScript/CustomScriptManagement';

export default class RestApi {
	// Note: We use different authentication here
	public readonly organization: OrganizationManagement = new OrganizationManagement(this.accountOptions);
	public readonly organizationTag: OrganizationTagManagement = new OrganizationTagManagement(this.organizationOptions);
	public readonly company: CompanyManagement = new CompanyManagement(this.accountOptions);
	public readonly firmwareVersion: FirmwareVersionManagement = new FirmwareVersionManagement(this.accountOptions);

	public readonly timing: TimingManagement = new TimingManagement(this.organizationOptions);
	/** @deprecated replaced by api.applet.command and will be removed in the future */
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.organizationOptions);

	public readonly applet: AppletManagement = new AppletManagement(this.organizationOptions);
	public readonly policy: PolicyManagement = new PolicyManagement(this.organizationOptions);
	public readonly bulkOperation: BulkOperationManagement = new BulkOperationManagement(this.organizationOptions);
	public readonly device: DeviceManagement = new DeviceManagement(this.accountOptions, this.organizationOptions);
	public readonly emulator: EmulatorManagement = new EmulatorManagement(this.accountOptions, this.device);
	public readonly deviceAlive: DeviceAliveManagement;
	public readonly deviceLocation: DeviceLocationManagement = new DeviceLocationManagement(this.organizationOptions);

	public readonly alert: AlertManagement = new AlertManagement(this.organizationOptions);
	public readonly package: PackageManagement = new PackageManagement(this.organizationOptions);

	public readonly location: LocationManagement = new LocationManagement(this.organizationOptions);
	public readonly locationOrganizationTag: LocationOrganizationTag = new LocationOrganizationTag(this.organizationOptions);

	public readonly customScript: CustomScriptManagement = new CustomScriptManagement(this.organizationOptions);

	constructor(
		public readonly accountOptions: IOptions,
		public readonly organizationOptions: IOptions,
	) {
		const paginator = new Paginator(this.organizationOptions);
		this.deviceAlive = new DeviceAliveManagement(this.organizationOptions, paginator);
	}
}
