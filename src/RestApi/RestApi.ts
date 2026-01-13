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
import { CustomScriptManagement } from './CustomScript/CustomScriptManagement';
import { PluginManagement } from './Plugin/PluginManagement';
import { RunnerManagement } from './Runner/RunnerManagement';
import { ContentGuardCategoryManagement } from './ContentGuard/Category/ContentGuardCategoryManagement';
import { ContentGuardItemManagement } from './ContentGuard/Item/ContentGuardItemManagement';
import { createDependencies } from './Dependencies';

export default class RestApi {
	// Note: We use different authentication here
	public readonly organization: OrganizationManagement;
	public readonly organizationTag: OrganizationTagManagement;
	public readonly company: CompanyManagement;
	public readonly firmwareVersion: FirmwareVersionManagement;

	public readonly timing: TimingManagement;
	/** @deprecated replaced by api.applet.command and will be removed in the future */
	public readonly timingCommand: TimingCommandManagement;

	public readonly applet: AppletManagement;
	public readonly policy: PolicyManagement;
	public readonly bulkOperation: BulkOperationManagement;
	public readonly device: DeviceManagement;
	public readonly emulator: EmulatorManagement;
	public readonly deviceAlive: DeviceAliveManagement;
	public readonly deviceLocation: DeviceLocationManagement;

	public readonly alert: AlertManagement;
	public readonly package: PackageManagement;

	public readonly location: LocationManagement;
	public readonly locationOrganizationTag: LocationOrganizationTag;

	public readonly customScript: CustomScriptManagement;
	public readonly plugin: PluginManagement;
	public readonly runner: RunnerManagement;

	public readonly contentGuardCategory: ContentGuardCategoryManagement;
	public readonly contentGuardItem: ContentGuardItemManagement;

	constructor(
		public readonly accountOptions: IOptions,
		public readonly organizationOptions: IOptions,
	) {
		const accountDependencies = createDependencies(this.accountOptions);
		const organizationDependencies = createDependencies(this.organizationOptions);

		this.organization = new OrganizationManagement(accountDependencies);
		this.organizationTag = new OrganizationTagManagement(organizationDependencies);
		this.company = new CompanyManagement(accountDependencies);
		this.firmwareVersion = new FirmwareVersionManagement(accountDependencies);
		this.timing = new TimingManagement(organizationDependencies);
		this.timingCommand = new TimingCommandManagement(organizationDependencies);
		this.applet = new AppletManagement(organizationDependencies);
		this.policy = new PolicyManagement(organizationDependencies);
		this.bulkOperation = new BulkOperationManagement(organizationDependencies);
		this.device = new DeviceManagement(accountDependencies, organizationDependencies);
		this.emulator = new EmulatorManagement(organizationDependencies);
		this.deviceAlive = new DeviceAliveManagement(organizationDependencies);
		this.deviceLocation = new DeviceLocationManagement(organizationDependencies);
		this.alert = new AlertManagement(organizationDependencies);
		this.package = new PackageManagement(organizationDependencies);
		this.location = new LocationManagement(organizationDependencies);
		this.locationOrganizationTag = new LocationOrganizationTag(organizationDependencies);
		this.customScript = new CustomScriptManagement(organizationDependencies);
		this.plugin = new PluginManagement(organizationDependencies);
		this.runner = new RunnerManagement(organizationDependencies);
		this.contentGuardCategory = new ContentGuardCategoryManagement(organizationDependencies);
		this.contentGuardItem = new ContentGuardItemManagement(organizationDependencies);
	}
}
