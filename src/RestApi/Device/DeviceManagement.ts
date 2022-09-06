import IOptions from '../IOptions';
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

	constructor(private accountOptions: IOptions, private organizationOptions: IOptions) {
		this.appVersion = new DeviceAppVersionManagement(organizationOptions);
		this.audio = new DeviceAudioManagement(organizationOptions);
		this.authentication = new DeviceAuthenticationManagement(organizationOptions);
		this.brightness = new DeviceBrightnessManagement(organizationOptions);
		this.dateTime = new DeviceDateTimeManagement(organizationOptions);
		this.debug = new DeviceDebugManagement(organizationOptions);
		this.provisioning = new DeviceProvisioningManagement(organizationOptions);
		this.firmware = new DeviceFirmwareManagement(organizationOptions);
		this.monitoring = new DeviceMonitoringManagement(organizationOptions);
		this.package = new DevicePackageManagement(organizationOptions);
		this.pinCode = new DevicePinCodeManagement(organizationOptions);
		this.powerAction = new DevicePowerActionManagement(organizationOptions);
		this.scheduledPowerAction = new DeviceScheduledPowerActionManagement(organizationOptions);
		this.screenshot = new DeviceScreenshotManagement(organizationOptions);
		this.remoteControl = new DeviceRemoteControlManagement(organizationOptions);
		this.resolution = new DeviceResolutionManagement(organizationOptions);
		this.timer = new DeviceTimerManagement(organizationOptions);
		this.verification = new DeviceVerificationManagement(organizationOptions);
		this.appletTest = new DeviceAppletTestManagement(organizationOptions);
		this.telemetry = new DeviceTelemetryManagement(organizationOptions);
		this.policy = new DevicePolicyManagement(organizationOptions);
		this.policyStatus = new DevicePolicyStatusManagement(organizationOptions);
		this.autoRecovery = new DeviceAutoRecoveryManagement(organizationOptions);
		this.peerRecovery = new DevicePeerRecoveryManagement(organizationOptions);
	}

	/**
	 * @deprecated
	 * use api.device.list() from API v2 for general device info
	 * use api.device.deviceAlive.list() for device alive status
	 * use api.device.telemetry.listLatest() for latest telemetry readings
	 */
	public async list(filter: IDeviceFilter = {}): Promise<IDevice[]> {
		const response = await getResource(this.organizationOptions, Resources.Device, filter);
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
		const response = await getResource(this.organizationOptions, Resources.Device + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}

	/**
	 * @deprecated use API v2 device set method
	 */
	public async set(deviceUid: string, settings: IDeviceUpdatable): Promise<void> {
		if (settings.name) {
			await putResource(this.organizationOptions, Resources.Device + '/' + deviceUid, JSON.stringify(settings));
		} else if (settings.organizationUid) {
			await putResource(this.accountOptions, `${Resources.Device}/${deviceUid}/organization`, JSON.stringify(settings));
		}
	}

}
