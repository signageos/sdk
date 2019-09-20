import IOptions from "../IOptions";
import { getResource, parseJSONResponse, putResource } from "../requester";
import IDeviceFilter from "./IDeviceFilter";
import Device from "./Device";
import IDevice, { IDeviceUpdatable } from "./IDevice";
import DeviceAppVersionManagement from "./AppVersion/DeviceAppVersionManagement";
import DeviceAudioManagement from "./Audio/DeviceAudioManagement";
import DeviceAuthenticationManagement from "./Authentication/DeviceAuthenticationManagement";
import DeviceBrightnessManagement from "./Brightness/DeviceBrightnessManagement";
import DeviceDateTimeManagement from "./DateTime/DeviceDateTimeManagement";
import DeviceDebugManagement from "./Debug/DeviceDebugManagement";
import DeviceProvisioningManagement from "./Provisioning/DeviceProvisioningManagement";
import DeviceFirmwareManagement from "./Firmware/DeviceFirmwareManagement";
import DeviceMonitoringManagement from "./Monitoring/DeviceMonitoringManagement";
import DevicePackageManagement from "./Package/DevicePackageManagement";
import DevicePinCodeManagement from "./PinCode/DevicePinCodeManagement";
import DevicePowerActionManagement from "./PowerAction/DevicePowerActionManagement";
import DeviceScheduledPowerActionManagement from "./PowerAction/DeviceScheduledPowerActionManagement";
import DeviceRemoteControlManagement from "./RemoteControl/DeviceRemoteControlManagement";
import DeviceResolutionManagement from "./Resolution/DeviceResolutionManagement";
import DeviceTimerManagement from "./Timer/DeviceTimerManagement";
import DeviceVerificationManagement from "./Verification/DeviceVerificationManagement";

export const RESOURCE: string = 'device';

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
	public timer: DeviceTimerManagement;
	public verification: DeviceVerificationManagement;

	constructor(private options: IOptions) {
		this.appVersion = new DeviceAppVersionManagement(options);
		this.audio = new DeviceAudioManagement(options);
		this.authentication = new DeviceAuthenticationManagement(options);
		this.brightness = new DeviceBrightnessManagement(options);
		this.dateTime = new DeviceDateTimeManagement(options);
		this.debug = new DeviceDebugManagement(options);
		this.provisioning = new DeviceProvisioningManagement(options);
		this.firmware = new DeviceFirmwareManagement(options);
		this.monitoring = new DeviceMonitoringManagement(options);
		this.package = new DevicePackageManagement(options);
		this.pinCode = new DevicePinCodeManagement(options);
		this.powerAction = new DevicePowerActionManagement(options);
		this.scheduledPowerAction = new DeviceScheduledPowerActionManagement(options);
		this.remoteControl = new DeviceRemoteControlManagement(options);
		this.resolution = new DeviceResolutionManagement(options);
		this.timer = new DeviceTimerManagement(options);
		this.verification = new DeviceVerificationManagement(options);
	}

	public async list(filter: IDeviceFilter = {}): Promise<IDevice[]> {
		const response = await getResource(this.options, RESOURCE, filter);
		const data: IDevice[] = await parseJSONResponse(response);

		return data.map((item: IDevice) => new Device(item));
	}

	public async get(deviceUid: string, filter: IDeviceFilter = {}): Promise<IDevice> {
		const response = await getResource(this.options, RESOURCE + '/' + deviceUid, filter);

		return new Device(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceUpdatable): Promise<void> {
		await putResource(this.options, RESOURCE + '/' + deviceUid, JSON.stringify(settings));
	}

}
