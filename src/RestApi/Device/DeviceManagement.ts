import { Dependencies } from '../Dependencies';
import { getResource, parseJSONResponse, putResource } from '../requester';
import { Resources } from '../resources';
import IDeviceFilter from './IDeviceFilter';
import Device from './Device';
import IDevice, { IDeviceUpdatable } from './IDevice';
import DeviceAppVersionManagement from './AppVersion/DeviceAppVersionManagement';
import DeviceAudioManagement from './Audio/DeviceAudioManagement';
import DeviceAuthenticationManagement from './Authentication/DeviceAuthenticationManagement';
import DeviceBrightnessManagement from './Brightness/DeviceBrightnessManagement';
import DeviceDateTimeManagement from './DateTime/DeviceDateTimeManagement';
import DeviceDebugManagement from './Debug/DeviceDebugManagement';
import DeviceProvisioningManagement from './Provisioning/DeviceProvisioningManagement';
import DeviceFirmwareManagement from './Firmware/DeviceFirmwareManagement';
import DeviceMonitoringManagement from './Monitoring/DeviceMonitoringManagement';
import DevicePackageManagement from './Package/DevicePackageManagement';
import DevicePinCodeManagement from './PinCode/DevicePinCodeManagement';
import DevicePowerActionManagement from './PowerAction/DevicePowerActionManagement';
import DeviceScheduledPowerActionManagement from './PowerAction/DeviceScheduledPowerActionManagement';
import DeviceScreenshotManagement from './Screenshot/DeviceScreenshotManagement';
import DeviceRemoteControlManagement from './RemoteControl/DeviceRemoteControlManagement';
import DeviceResolutionManagement from './Resolution/DeviceResolutionManagement';
import DeviceTimerManagement from './Timer/DeviceTimerManagement';
import DeviceVerificationManagement from './Verification/DeviceVerificationManagement';
import DeviceAppletTestManagement from './AppletTest/DeviceAppletTestManagement';
import DeviceTelemetryManagement from './Telemetry/DeviceTelemetryManagement';
import DevicePolicyManagement from './Policy/DevicePolicyManagement';
import DevicePolicyStatusManagement from './PolicyStatus/DevicePolicyStatusManagement';
import DeviceAutoRecoveryManagement from './AutoRecovery/DeviceAutoRecoveryManagement';
import DevicePeerRecoveryManagement from './PeerRecovery/DevicePeerRecoveryManagement';
import DeviceConfigurationManagement from './Configuration/DeviceConfigurationManagement';
import DeviceConnectManagement from './Connect/DeviceConnectManagement';
import DeviceExtendedManagementUrlManagement from './ExtendedManagementUrl/DeviceExtendedManagementUrlManagement';

export default class DeviceManagement {
	public appVersion: DeviceAppVersionManagement;
	public audio: DeviceAudioManagement;
	public authentication: DeviceAuthenticationManagement;
	public brightness: DeviceBrightnessManagement;
	public dateTime: DeviceDateTimeManagement;
	public debug: DeviceDebugManagement;
	public firmware: DeviceFirmwareManagement;
	public monitoring: DeviceMonitoringManagement;
	public package: DevicePackageManagement;
	public pinCode: DevicePinCodeManagement;
	public powerAction: DevicePowerActionManagement;
	public provisioning: DeviceProvisioningManagement;
	public resolution: DeviceResolutionManagement;
	public remoteControl: DeviceRemoteControlManagement;
	public scheduledPowerAction: DeviceScheduledPowerActionManagement;
	public screenshot: DeviceScreenshotManagement;
	public timer: DeviceTimerManagement;
	public verification: DeviceVerificationManagement;
	public appletTest: DeviceAppletTestManagement;
	public telemetry: DeviceTelemetryManagement;
	public policy: DevicePolicyManagement;
	public policyStatus: DevicePolicyStatusManagement;
	public autoRecovery: DeviceAutoRecoveryManagement;
	public peerRecovery: DevicePeerRecoveryManagement;
	public configuration: DeviceConfigurationManagement;
	public connect: DeviceConnectManagement;
	public extendedManagementUrl: DeviceExtendedManagementUrlManagement;

	constructor(
		private readonly accountDI: Dependencies,
		private readonly organizationDI: Dependencies,
	) {
		this.appVersion = new DeviceAppVersionManagement(organizationDI.options);
		this.audio = new DeviceAudioManagement(organizationDI.options);
		this.authentication = new DeviceAuthenticationManagement(organizationDI.options);
		this.brightness = new DeviceBrightnessManagement(organizationDI.options);
		this.dateTime = new DeviceDateTimeManagement(organizationDI.options);
		this.debug = new DeviceDebugManagement(organizationDI.options);
		this.provisioning = new DeviceProvisioningManagement(organizationDI.options);
		this.firmware = new DeviceFirmwareManagement(organizationDI.options);
		this.monitoring = new DeviceMonitoringManagement(organizationDI.options);
		this.package = new DevicePackageManagement(organizationDI.options);
		this.pinCode = new DevicePinCodeManagement(organizationDI.options);
		this.powerAction = new DevicePowerActionManagement(organizationDI.options);
		this.scheduledPowerAction = new DeviceScheduledPowerActionManagement(organizationDI.options);
		this.screenshot = new DeviceScreenshotManagement(organizationDI.options);
		this.remoteControl = new DeviceRemoteControlManagement(organizationDI.options);
		this.resolution = new DeviceResolutionManagement(organizationDI.options);
		this.timer = new DeviceTimerManagement(organizationDI.options);
		this.verification = new DeviceVerificationManagement(organizationDI.options);
		this.appletTest = new DeviceAppletTestManagement(organizationDI.options);
		this.telemetry = new DeviceTelemetryManagement(organizationDI.options);
		this.policy = new DevicePolicyManagement(organizationDI.options);
		this.policyStatus = new DevicePolicyStatusManagement(organizationDI.options);
		this.autoRecovery = new DeviceAutoRecoveryManagement(organizationDI.options);
		this.peerRecovery = new DevicePeerRecoveryManagement(organizationDI.options);
		this.configuration = new DeviceConfigurationManagement(organizationDI.options);
		this.connect = new DeviceConnectManagement(organizationDI.options);
		this.extendedManagementUrl = new DeviceExtendedManagementUrlManagement(organizationDI.options);
	}

	/**
	 * @deprecated
	 * use api.device.list() from API v2 for general device info
	 * use api.device.deviceAlive.list() for device alive status
	 * use api.device.telemetry.listLatest() for latest telemetry readings
	 */
	public async list(filter: IDeviceFilter = {}): Promise<IDevice[]> {
		const response = await getResource(this.organizationDI.options, Resources.Device, filter);
		const data: IDevice[] = await parseJSONResponse(response);

		return data.map((item: IDevice) => new Device(item));
	}

	/**
	 * @deprecated
	 * use api.device.get(deviceUid) from API v2 for general device info
	 * use api.device.deviceAlive.get(deviceUid) for device alive status
	 * use api.device.telemetry.getLatest(deviceUid) for latest telemetry readings
	 */
	public async get(deviceUid: string, filter: IDeviceFilter = {}): Promise<IDevice> {
		const response = await getResource(this.organizationDI.options, Resources.Device + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}

	/**
	 * @deprecated use API v2 device set method
	 */
	public async set(deviceUid: string, settings: IDeviceUpdatable): Promise<void> {
		if (settings.name) {
			await putResource(this.organizationDI.options, Resources.Device + '/' + deviceUid, JSON.stringify(settings));
		} else if (settings.organizationUid) {
			await putResource(this.accountDI.options, `${Resources.Device}/${deviceUid}/organization`, JSON.stringify(settings));
		}
	}
}
