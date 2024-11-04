import { IPeerRecoveryConfiguration, IPeerRecoverySettings } from '@signageos/front-applet/es6/FrontApplet/Management/IPeerRecovery';
import {
	ManagementPeerRecoveryGetRequest,
	ManagementPeerRecoveryGetResult,
	ManagementPeerRecoverySetRequest,
	ManagementPeerRecoverySetResult,
} from '@signageos/front-applet/es6/Monitoring/Management/PeerRecovery/peerRecoveryCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export interface IManagementPeerRecovery {
	get(): Promise<IPeerRecoverySettings>;
	set(settings: IPeerRecoveryConfiguration): Promise<void>;
}

export default class ManagementPeerRecoveryCommands implements IManagementPeerRecovery {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async get(): Promise<IPeerRecoverySettings> {
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
