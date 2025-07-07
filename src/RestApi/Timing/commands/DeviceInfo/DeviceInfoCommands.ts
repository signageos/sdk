import { IDeviceInfo, IDeviceLocation, IOrganizationTag } from '@signageos/front-applet/es6/FrontApplet/DeviceInfo/IDeviceInfo';
import { waitUntilReturnValue } from '../../../../Timer/waitUntil';
import {
	DeviceInfoGetDeviceNameRequest,
	DeviceInfoGetDeviceNameResult,
	DeviceInfoGetLocationRequest,
	DeviceInfoGetLocationResult,
	DeviceInfoGetOrganizationTagsRequest,
	DeviceInfoGetOrganizationTagsResult,
} from '@signageos/front-applet/es6/Monitoring/DeviceInfo/deviceInfoCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export default class DeviceInfoCommands implements IDeviceInfo {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async getLocation(): Promise<IDeviceLocation | null> {
		const command = await this.appletCommandManagement.send<DeviceInfoGetLocationRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: DeviceInfoGetLocationRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<DeviceInfoGetLocationResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: DeviceInfoGetLocationResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}

	public async getOrganizationTags(): Promise<IOrganizationTag[]> {
		const command = await this.appletCommandManagement.send<DeviceInfoGetOrganizationTagsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: DeviceInfoGetOrganizationTagsRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<DeviceInfoGetOrganizationTagsResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: DeviceInfoGetOrganizationTagsResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}

	public async getDeviceName(): Promise<string> {
		const command = await this.appletCommandManagement.send<DeviceInfoGetDeviceNameRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: DeviceInfoGetDeviceNameRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<DeviceInfoGetDeviceNameResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: DeviceInfoGetDeviceNameResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}
}
