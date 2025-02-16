import {
	ManagementDebugEnableRequest,
	ManagementDebugEnableResult,
	ManagementDebugDisableRequest,
	ManagementDebugDisableResult,
	ManagementDebugIsEnabledRequest,
	ManagementDebugIsEnabledResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Debug/debugCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IDebug from '@signageos/front-applet/es6/FrontApplet/Management/Debug/IDebug';
import { waitUntilReturnValue } from '../../../../Timer/waitUntil';

export default class ManagementDebugCommands implements IDebug {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async enable(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementDebugEnableRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementDebugEnableRequest,
			},
		});
		await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementDebugEnableResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementDebugEnableResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}

	public async disable(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementDebugDisableRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementDebugDisableRequest,
			},
		});
		await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementDebugDisableResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementDebugDisableResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}

	public async isEnabled(): Promise<boolean> {
		const command = await this.appletCommandManagement.send<ManagementDebugIsEnabledRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementDebugIsEnabledRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementDebugIsEnabledResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementDebugIsEnabledResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}
}
