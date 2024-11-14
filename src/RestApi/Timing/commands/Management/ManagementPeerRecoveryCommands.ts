import {
	ManagementPeerRecoveryGetRequest,
	ManagementPeerRecoveryGetResult,
	ManagementPeerRecoverySetRequest,
	ManagementPeerRecoverySetResult,
} from '@signageos/front-applet/es6/Monitoring/Management/PeerRecovery/peerRecoveryCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IPeerRecovery, {
	IPeerRecoveryConfiguration,
} from "@signageos/front-applet/es6/FrontApplet/Management/PeerRecovery/IPeerRecovery";

export default class ManagementPeerRecoveryCommands implements IPeerRecovery {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async get(): Promise<IPeerRecoveryConfiguration> {
		const command = await this.appletCommandManagement.send<ManagementPeerRecoveryGetRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPeerRecoveryGetRequest,
			},
		});
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<ManagementPeerRecoveryGetResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPeerRecoveryGetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async set(configuration: IPeerRecoveryConfiguration): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPeerRecoverySetRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPeerRecoverySetRequest,
				configuration,
			},
		});
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<ManagementPeerRecoverySetResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPeerRecoverySetResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
