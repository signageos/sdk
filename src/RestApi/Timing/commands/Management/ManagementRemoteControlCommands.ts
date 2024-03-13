import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementRemoteControlDisableRequest,
	ManagementRemoteControlDisableResult,
	ManagementRemoteControlEnableRequest,
	ManagementRemoteControlEnableResult,
	ManagementRemoteControlIsEnabledRequest,
	ManagementRemoteControlIsEnabledResult,
	ManagementRemoteControlIsLockedRequest,
	ManagementRemoteControlIsLockedResult,
	ManagementRemoteControlLockRequest,
	ManagementRemoteControlLockResult,
	ManagementRemoteControlUnlockRequest,
	ManagementRemoteControlUnlockResult,
} from '@signageos/front-applet/es6/Monitoring/Management/RemoteControl/remoteControlCommands';
import wait from '../../../../Timer/wait';

export interface IManagementRemoteControl {
	enable(): Promise<void>;
	disable(): Promise<void>;
	isEnabled(): Promise<boolean>;
	lock(): Promise<void>;
	unlock(): Promise<void>;
	isLocked(): Promise<boolean>;
}

export default class ManagementRemoteControlCommands implements IManagementRemoteControl {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async enable(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementRemoteControlEnableRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementRemoteControlEnableRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementRemoteControlEnableResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementRemoteControlEnableResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async disable(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementRemoteControlDisableRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementRemoteControlDisableRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementRemoteControlDisableResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementRemoteControlDisableResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isEnabled(): Promise<boolean> {
		const command = await this.timingCommandManagement.create<ManagementRemoteControlIsEnabledRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementRemoteControlIsEnabledRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementRemoteControlIsEnabledResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementRemoteControlIsEnabledResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async lock(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementRemoteControlLockRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementRemoteControlLockRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementRemoteControlLockResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementRemoteControlLockResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async unlock(): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementRemoteControlUnlockRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementRemoteControlUnlockRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementRemoteControlUnlockResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementRemoteControlUnlockResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isLocked(): Promise<boolean> {
		const command = await this.timingCommandManagement.create<ManagementRemoteControlIsLockedRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementRemoteControlIsLockedRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementRemoteControlIsLockedResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementRemoteControlIsLockedResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
