import { IAutoRecoveryConfiguration, IAutoRecoverySettings } from '@signageos/front-applet/es6/FrontApplet/Management/IAutoRecovery';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementAutoRecoveryGetRequest,
	ManagementAutoRecoveryGetResult,
	ManagementAutoRecoverySetRequest,
	ManagementAutoRecoverySetResult,
} from '@signageos/front-applet/es6/Monitoring/Management/AutoRecovery/autoRecoveryCommands';
import wait from '../../../../Timer/wait';

export interface IManagementAutoRecovery {
	get(): Promise<IAutoRecoverySettings>;
	set(settings: IAutoRecoveryConfiguration): Promise<void>;
}

export default class ManagementAutoRecoveryCommands implements IManagementAutoRecovery {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async get(): Promise<IAutoRecoverySettings> {
		const command = await this.timingCommandManagement.create<ManagementAutoRecoveryGetRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementAutoRecoveryGetRequest,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementAutoRecoveryGetResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementAutoRecoveryGetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async set(configuration: IAutoRecoveryConfiguration): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementAutoRecoverySetRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementAutoRecoverySetRequest,
				configuration,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementAutoRecoverySetResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementAutoRecoverySetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
