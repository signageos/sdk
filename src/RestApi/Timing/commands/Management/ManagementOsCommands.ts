import IOSInfo from '@signageos/front-applet/es6/FrontApplet/Management/IOSInfo';
import { SystemMemoryInfo } from '@signageos/front-applet/es6/FrontApplet/Management/OS';
import {
	ManagementOsGetCpuUsageRequest,
	ManagementOsGetInfoRequest,
	ManagementOsGetInfoResult,
	ManagementOsGetCpuUsageResult,
	ManagementOsGetMemoryUsageRequest,
	ManagementOsGetMemoryUsageResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Os/osCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export interface IManagementOs {
	getInfo(): Promise<IOSInfo>;
	getCpuUsage(): Promise<number>;
	getMemoryUsage(): Promise<SystemMemoryInfo>;
}

export default class ManagementOsCommands implements IManagementOs {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async getInfo(): Promise<IOSInfo> {
		const command = await this.appletCommandManagement.send<ManagementOsGetInfoRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementOsGetInfoRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementOsGetInfoResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementOsGetInfoResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getCpuUsage(): Promise<number> {
		const command = await this.appletCommandManagement.send<ManagementOsGetCpuUsageRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementOsGetCpuUsageRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementOsGetCpuUsageResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementOsGetCpuUsageResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getMemoryUsage(): Promise<SystemMemoryInfo> {
		const command = await this.appletCommandManagement.send<ManagementOsGetMemoryUsageRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementOsGetMemoryUsageRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementOsGetMemoryUsageResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementOsGetMemoryUsageResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
