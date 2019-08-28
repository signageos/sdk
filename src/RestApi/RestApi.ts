import TimingManagement from './Timing/TimingManagement';
import IOptions from './IOptions';
import TimingCommandManagement from './Timing/Command/TimingCommandManagement';
import DeviceManagement from "./Device/DeviceManagement";
import DevicePinManagement from "./Device/Pin/DevicePinManagement";
import DeviceBrightnessManagement from "./Device/Brightness/DeviceBrightnessManagement";
import DevicePackageManagement from "./Device/Package/DevicePackageManagement";
import DeviceVolumeManagement from "./Device/Volume/DeviceVolumeManagement";
import AppletManagement from "./Applet/AppletManagement";
import AppletVersionManagement from "./Applet/Version/AppletVersionManagement";
import OrganizationManagement from "./Organization/OrganizationManagement";
import DeviceAppVersionManagement from "./Device/AppVersion/DeviceAppVersionManagement";
import DeviceAuthenticationManagement from "./Device/Authentication/DeviceAuthenticationManagement";
import DeviceDebugManagement from "./Device/Debug/DeviceDebugManagement";
import DeviceDeprovisionManagement from "./Device/Deprovision/DeviceDeprovisionManagement";
import DeviceFirmwareManagement from "./Device/Firmware/DeviceFirmwareManagement";
import DevicePowerActionManagement from "./Device/PowerAction/DevicePowerActionManagement";
import DeviceScheduledPowerActionManagement from "./Device/PowerAction/DeviceScheduledPowerActionManagement";
import DeviceRemoteControlManagement from "./Device/RemoteControl/DeviceRemoteControlManagement";
import DeviceResolutionManagement from "./Device/Resolution/DeviceResolutionManagement";
import DeviceTimeManagement from "./Device/Time/DeviceTimeManagement";
import DeviceTimerManagement from "./Device/Timer/DeviceTimerManagement";
import DeviceVerificationManagement from "./Device/Verification/DeviceVerificationManagement";
import DeviceMonitoringManagement from "./Device/Monitoring/DeviceMonitoringManagement";
import AppletCommandManagement from "./Applet/Command/AppletCommandManagement";

export default class RestApi {

	// Note: We use different authentication here
	public readonly organization: OrganizationManagement = new OrganizationManagement(this.accountOptions);

	public readonly timing: TimingManagement = new TimingManagement(this.options);
	public readonly timingCommand: TimingCommandManagement = new TimingCommandManagement(this.options);

	public readonly applet: AppletManagement = new AppletManagement(this.options);
	public readonly appletVersion: AppletVersionManagement = new AppletVersionManagement(this.options);
	public readonly appletCommand: AppletCommandManagement = new AppletCommandManagement(this.options);

	public readonly device: DeviceManagement = new DeviceManagement(this.options);
	public readonly deviceAppVersion: DeviceAppVersionManagement = new DeviceAppVersionManagement(this.options);
	public readonly deviceAuthentication: DeviceAuthenticationManagement = new DeviceAuthenticationManagement(this.options);
	public readonly deviceBrightness: DeviceBrightnessManagement = new DeviceBrightnessManagement(this.options);
	public readonly deviceDebug: DeviceDebugManagement = new DeviceDebugManagement(this.options);
	public readonly deviceDeprovision: DeviceDeprovisionManagement = new DeviceDeprovisionManagement(this.options);
	public readonly deviceFirmware: DeviceFirmwareManagement = new DeviceFirmwareManagement(this.options);
	public readonly deviceMonitoring: DeviceMonitoringManagement = new DeviceMonitoringManagement(this.options);
	public readonly devicePackage: DevicePackageManagement = new DevicePackageManagement(this.options);
	public readonly devicePin: DevicePinManagement = new DevicePinManagement(this.options);
	public readonly devicePowerAction: DevicePowerActionManagement = new DevicePowerActionManagement(this.options);
	public readonly deviceScheduledPowerAction: DeviceScheduledPowerActionManagement = new DeviceScheduledPowerActionManagement(this.options);
	public readonly deviceRemoteControl: DeviceRemoteControlManagement = new DeviceRemoteControlManagement(this.options);
	public readonly deviceResolution: DeviceResolutionManagement = new DeviceResolutionManagement(this.options);
	public readonly deviceTime: DeviceTimeManagement = new DeviceTimeManagement(this.options);
	public readonly deviceTimer: DeviceTimerManagement = new DeviceTimerManagement(this.options);
	public readonly deviceVerification: DeviceVerificationManagement = new DeviceVerificationManagement(this.options);
	public readonly deviceVolume: DeviceVolumeManagement = new DeviceVolumeManagement(this.options);

	constructor(
		private options: IOptions,
		private accountOptions: IOptions
	) {
	}
}
