import {
	ManagementAutoRecoveryGetRequest,
	ManagementAutoRecoveryGetResult,
	ManagementAutoRecoverySetRequest,
	ManagementAutoRecoverySetResult,
} from '@signageos/front-applet/es6/Monitoring/Management/AutoRecovery/autoRecoveryCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IAutoRecovery, { IAutoRecoveryConfiguration } from '@signageos/front-applet/es6/FrontApplet/Management/AutoRecovery/IAutoRecovery';
import { waitUntilReturnValue } from '../../../../Timer/waitUntil';

export default class ManagementAutoRecoveryCommands implements IAutoRecovery {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async get(): Promise<IAutoRecoveryConfiguration> {
		const command = await this.appletCommandManagement.send<ManagementAutoRecoveryGetRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementAutoRecoveryGetRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementAutoRecoveryGetResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementAutoRecoveryGetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async set(configuration: IAutoRecoveryConfiguration): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementAutoRecoverySetRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementAutoRecoverySetRequest,
				configuration,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementAutoRecoverySetResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementAutoRecoverySetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}
}
