import {
	ManagementAudioGetVolumeRequest,
	ManagementAudioGetVolumeResult,
	ManagementAudioSetVolumeRequest,
	ManagementAudioSetVolumeResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Audio/audioCommands';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IAudio from '@signageos/front-applet/es6/FrontApplet/Management/Audio/IAudio';
import { waitUntilReturnValue } from '../../../../Timer/waitUntil';

export default class ManagementAudioCommands implements IAudio {
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
		return await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementAudioGetVolumeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementAudioGetVolumeResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.volume;
			}
		});
	}

	public async setVolume(volume: number): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementAudioSetVolumeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementAudioSetVolumeRequest,
				volume,
			},
		});
		await waitUntilReturnValue(async () => {
			const systemRebootCommands = await this.appletCommandManagement.list<ManagementAudioSetVolumeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementAudioSetVolumeResult,
			});
			if (systemRebootCommands.length > 0) {
				return systemRebootCommands[0].command.result;
			}
		});
	}
}
