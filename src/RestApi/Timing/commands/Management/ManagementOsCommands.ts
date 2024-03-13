import IOSInfo from '@signageos/front-applet/es6/FrontApplet/Management/IOSInfo';
import { SystemMemoryInfo } from '@signageos/front-applet/es6/FrontApplet/Management/OS';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementOsGetCpuUsageRequest,
	ManagementOsGetInfoRequest,
	ManagementOsGetInfoResult,
	ManagementOsGetCpuUsageResult,
	ManagementOsGetMemoryUsageRequest,
	ManagementOsGetMemoryUsageResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Os/osCommands';
import wait from '../../../../Timer/wait';

export interface IManagementOs {
	getInfo(): Promise<IOSInfo>;
	getCpuUsage(): Promise<number>;
	getMemoryUsage(): Promise<SystemMemoryInfo>;
}

export default class ManagementOsCommands implements IManagementOs {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async getInfo(): Promise<IOSInfo> {
		const command = await this.timingCommandManagement.create<ManagementOsGetInfoRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementOsGetInfoRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementOsGetInfoResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementOsGetInfoResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getCpuUsage(): Promise<number> {
		const command = await this.timingCommandManagement.create<ManagementOsGetCpuUsageRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementOsGetCpuUsageRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementOsGetCpuUsageResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementOsGetCpuUsageResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getMemoryUsage(): Promise<SystemMemoryInfo> {
		const command = await this.timingCommandManagement.create<ManagementOsGetMemoryUsageRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementOsGetMemoryUsageRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementOsGetMemoryUsageResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementOsGetMemoryUsageResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
