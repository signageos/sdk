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
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IRemoteControl from "@signageos/front-applet/es6/FrontApplet/Management/RemoteControl/IRemoteControl";

export default class ManagementRemoteControlCommands implements IRemoteControl {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async enable(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementRemoteControlEnableRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementRemoteControlEnableRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementRemoteControlEnableResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementRemoteControlEnableResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async disable(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementRemoteControlDisableRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementRemoteControlDisableRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementRemoteControlDisableResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementRemoteControlDisableResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isEnabled(): Promise<boolean> {
		const command = await this.appletCommandManagement.send<ManagementRemoteControlIsEnabledRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementRemoteControlIsEnabledRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementRemoteControlIsEnabledResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementRemoteControlIsEnabledResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async lock(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementRemoteControlLockRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementRemoteControlLockRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementRemoteControlLockResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementRemoteControlLockResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async unlock(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementRemoteControlUnlockRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementRemoteControlUnlockRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementRemoteControlUnlockResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementRemoteControlUnlockResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isLocked(): Promise<boolean> {
		const command = await this.appletCommandManagement.send<ManagementRemoteControlIsLockedRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementRemoteControlIsLockedRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementRemoteControlIsLockedResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementRemoteControlIsLockedResult,
				},
			);
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
