import {
	ManagementPowerClearScheduledRebootsRequest,
	ManagementPowerClearScheduledRebootsResult,
	ManagementPowerGetProprietaryTimersRequest,
	ManagementPowerGetProprietaryTimersResult,
	ManagementPowerGetScheduledRebootsRequest,
	ManagementPowerGetScheduledRebootsResult,
	ManagementPowerGetTimersRequest,
	ManagementPowerGetTimersResult,
	ManagementPowerRemoveScheduledRebootRequest,
	ManagementPowerRemoveScheduledRebootResult,
	ManagementPowerSetProprietaryTimerRequest,
	ManagementPowerSetProprietaryTimerResult,
	ManagementPowerSetScheduledRebootRequest,
	ManagementPowerSetScheduledRebootResult,
	ManagementPowerSetTimerRequest,
	ManagementPowerSetTimerResult,
	ManagementPowerUnsetProprietaryTimerRequest,
	ManagementPowerUnsetProprietaryTimerResult,
	ManagementPowerUnsetTimerRequest,
	ManagementPowerUnsetTimerResult,
	PowerAppRestartRequest,
	PowerAppRestartResult,
	PowerSystemRebootRequest,
	PowerSystemRebootResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Power/powerCommands';
import { ITimer, TimerType } from '@signageos/front-applet/es6/FrontApplet/Management/helpers/TimerHelper';
import { IProprietaryTimer } from '@signageos/front-applet/es6/FrontApplet/Management/helpers/ProprietaryTimerHelper';
import { waitUntilResult, waitUntilReturnValue } from '../../../../Timer/waitUntil';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IPower, { IScheduledRebootActions, WeekdayType } from '@signageos/front-applet/es6/FrontApplet/Management/Power/IPower';

export default class ManagementPowerCommands implements IPower {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async systemReboot(): Promise<void> {
		const command = await this.appletCommandManagement.send<PowerSystemRebootRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: PowerSystemRebootRequest,
			},
		});
		//TODO: This might fail if device will not send result
		await waitUntilResult(async () => {
			const results = await this.appletCommandManagement.list<PowerSystemRebootResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: PowerSystemRebootResult,
			});
			return results.length > 0;
		});
	}

	public async appRestart(): Promise<void> {
		const command = await this.appletCommandManagement.send<PowerAppRestartRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: PowerAppRestartRequest,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<PowerAppRestartResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: PowerAppRestartResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async getTimers(): Promise<ITimer[]> {
		const command = await this.appletCommandManagement.send<ManagementPowerGetTimersRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerGetTimersRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerGetTimersResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPowerGetTimersResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.timers;
			}
		});
	}

	public async setTimer(
		type: keyof typeof TimerType,
		timeOn: string | null,
		timeOff: string | null,
		weekdays: string[],
		volume: number,
	): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerSetTimerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerSetTimerRequest,
				timerType: type,
				timeOn,
				timeOff,
				weekdays,
				volume,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerSetTimerResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPowerSetTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async unsetTimer(type: keyof typeof TimerType): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerUnsetTimerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerUnsetTimerRequest,
				timerType: type,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerUnsetTimerResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPowerUnsetTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async getProprietaryTimers(): Promise<IProprietaryTimer[]> {
		const command = await this.appletCommandManagement.send<ManagementPowerGetProprietaryTimersRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerGetProprietaryTimersRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerGetProprietaryTimersResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerGetProprietaryTimersResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async setProprietaryTimer(
		type: keyof typeof TimerType,
		timeOn: string | null,
		timeOff: string | null,
		weekdays: string[],
		keepAppletRunning: boolean,
	): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerSetProprietaryTimerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerSetProprietaryTimerRequest,
				timerType: type,
				timeOn,
				timeOff,
				weekdays,
				keepAppletRunning,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerSetProprietaryTimerResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerSetProprietaryTimerResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async unsetProprietaryTimer(type: keyof typeof TimerType): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerUnsetProprietaryTimerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerUnsetProprietaryTimerRequest,
				timerType: type,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerUnsetProprietaryTimerResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerUnsetProprietaryTimerResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async clearScheduledReboots(): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerClearScheduledRebootsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerClearScheduledRebootsRequest,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerClearScheduledRebootsResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerClearScheduledRebootsResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async getScheduledReboots(): Promise<IScheduledRebootActions[]> {
		const command = await this.appletCommandManagement.send<ManagementPowerGetScheduledRebootsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerGetScheduledRebootsRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerGetScheduledRebootsResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerGetScheduledRebootsResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async removeScheduledReboot(id: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerRemoveScheduledRebootRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerRemoveScheduledRebootRequest,
				id,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerRemoveScheduledRebootResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerRemoveScheduledRebootResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}

	public async setScheduledReboot(weekdays: WeekdayType[], time: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerSetScheduledRebootRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerSetScheduledRebootRequest,
				weekdays,
				time,
			},
		});
		await waitUntilReturnValue(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerSetScheduledRebootResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: command.receivedAt,
					type: ManagementPowerSetScheduledRebootResult,
				},
			);
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
		});
	}
}
