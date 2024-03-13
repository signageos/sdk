import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	ManagementAudioGetVolumeRequest,
	ManagementAudioGetVolumeResult,
	ManagementAudioSetVolumeRequest,
	ManagementAudioSetVolumeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Audio/audioCommands';
import wait from '../../../../Timer/wait';

export interface IManagementAudio {
	getVolume(): Promise<number>;
	setVolume(volume: number): Promise<void>;
}

export default class ManagementAudioCommands implements IManagementAudio {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async getVolume(): Promise<number> {
		const command = await this.timingCommandManagement.create<ManagementAudioGetVolumeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementAudioGetVolumeRequest,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementAudioGetVolumeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementAudioGetVolumeResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.volume;
			}
			await wait(500);
		}
	}

	public async setVolume(volume: number): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementAudioSetVolumeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementAudioSetVolumeRequest,
				volume,
			},
		});
		while (true) {
			const systemRebootCommands = await this.timingCommandManagement.getList<ManagementAudioSetVolumeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementAudioSetVolumeResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
