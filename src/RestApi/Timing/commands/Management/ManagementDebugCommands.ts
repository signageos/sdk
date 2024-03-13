import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementDebugEnableRequest,
	ManagementDebugEnableResult,
	ManagementDebugDisableRequest,
	ManagementDebugDisableResult,
	ManagementDebugIsEnabledRequest,
	ManagementDebugIsEnabledResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Debug/debugCommands';
import wait from '../../../../Timer/wait';

export interface IManagementDebug {
	enable(): Promise<void>;
	disable(): Promise<void>;
	isEnabled(): Promise<boolean>;
}

export default class ManagementDebugCommands implements IManagementDebug {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async enable(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementDebugEnableRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementDebugEnableRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementDebugEnableResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementDebugEnableResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async disable(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementDebugDisableRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementDebugDisableRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementDebugDisableResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementDebugDisableResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isEnabled(): Promise<boolean> {
		const command = await this.timingCommandManagement.create<ManagementDebugIsEnabledRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementDebugIsEnabledRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementDebugIsEnabledResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementDebugIsEnabledResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
