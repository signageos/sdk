import { IPeerRecoveryConfiguration, IPeerRecoverySettings } from '@signageos/front-applet/es6/FrontApplet/Management/IPeerRecovery';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementPeerRecoveryGetRequest,
	ManagementPeerRecoveryGetResult,
	ManagementPeerRecoverySetRequest,
	ManagementPeerRecoverySetResult,
} from '@signageos/front-applet/es6/Monitoring/Management/PeerRecovery/peerRecoveryCommands';
import wait from '../../../../Timer/wait';

export interface IManagementPeerRecovery {
	get(): Promise<IPeerRecoverySettings>;
	set(settings: IPeerRecoveryConfiguration): Promise<void>;
}

export default class ManagementPeerRecoveryCommands implements IManagementPeerRecovery {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async get(): Promise<IPeerRecoverySettings> {
		const command = await this.timingCommandManagement.create<ManagementPeerRecoveryGetRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPeerRecoveryGetRequest,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPeerRecoveryGetResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPeerRecoveryGetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async set(configuration: IPeerRecoveryConfiguration): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementPeerRecoverySetRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPeerRecoverySetRequest,
				configuration,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPeerRecoverySetResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPeerRecoverySetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
