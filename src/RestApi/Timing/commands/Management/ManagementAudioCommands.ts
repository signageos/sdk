import {
	ManagementAudioGetVolumeRequest,
	ManagementAudioGetVolumeResult,
	ManagementAudioSetVolumeRequest,
	ManagementAudioSetVolumeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Audio/audioCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export interface IManagementAudio {
	getVolume(): Promise<number>;
	setVolume(volume: number): Promise<void>;
}

export default class ManagementAudioCommands implements IManagementAudio {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async getVolume(): Promise<number> {
		const command = await this.appletCommandManagement.send<ManagementAudioGetVolumeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementAudioGetVolumeRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementAudioGetVolumeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementAudioGetVolumeResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.volume;
			}
			await wait(500);
		}
	}

	public async setVolume(volume: number): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementAudioSetVolumeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementAudioSetVolumeRequest,
				volume,
			},
		});
		while (true) {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementAudioSetVolumeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementAudioSetVolumeResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
