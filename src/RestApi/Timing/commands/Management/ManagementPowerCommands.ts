import {
	ManagementPowerGetProprietaryTimersRequest,
	ManagementPowerGetProprietaryTimersResult,
	ManagementPowerGetTimersRequest,
	ManagementPowerGetTimersResult,
	ManagementPowerSetProprietaryTimerRequest,
	ManagementPowerSetProprietaryTimerResult,
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
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import wait from '../../../../Timer/wait';
import { ITimer, TimerType } from '@signageos/front-applet/es6/FrontApplet/Management/helpers/TimerHelper';
import { IProprietaryTimer } from '@signageos/front-applet/es6/FrontApplet/Management/helpers/ProprietaryTimerHelper';
import waitUntil from '../../../../Timer/waitUntil';

export interface IManagementPower {
	systemReboot(): Promise<void>;
	appRestart(): Promise<void>;
	getTimers(): Promise<ITimer[]>;
	setTimer(type: keyof typeof TimerType, timeOn: string | null, timeOff: string | null, weekdays: string[], volume: number): Promise<void>;
	unsetTimer(type: keyof typeof TimerType): Promise<void>;
	getProprietaryTimers(): Promise<IProprietaryTimer[]>;
	setProprietaryTimer(
		type: keyof typeof TimerType,
		timeOn: string | null,
		timeOff: string | null,
		weekdays: string[],
		keepAppletRunning: boolean,
	): Promise<void>;
	unsetProprietaryTimer(type: keyof typeof TimerType): Promise<void>;
}

export default class ManagementPowerCommands implements IManagementPower {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async systemReboot(): Promise<void> {
		const command = await this.timingCommandManagement.create<PowerSystemRebootRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: PowerSystemRebootRequest,
			},
		});
		return waitUntil(async () => {
			const results = await this.timingCommandManagement.getList<PowerSystemRebootResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: PowerSystemRebootResult,
			});
			return results.length > 0;
		});
	}

	public async appRestart(): Promise<void> {
		const command = await this.timingCommandManagement.create<PowerAppRestartRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: PowerAppRestartRequest,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<PowerAppRestartResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: PowerAppRestartResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getTimers(): Promise<ITimer[]> {
		const command = await this.timingCommandManagement.create<ManagementPowerGetTimersRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPowerGetTimersRequest,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPowerGetTimersResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPowerGetTimersResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.timers;
			}
			await wait(500);
		}
	}

	public async setTimer(
		type: keyof typeof TimerType,
		timeOn: string | null,
		timeOff: string | null,
		weekdays: string[],
		volume: number,
	): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementPowerSetTimerRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPowerSetTimerRequest,
				timerType: type,
				timeOn,
				timeOff,
				weekdays,
				volume,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPowerSetTimerResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPowerSetTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async unsetTimer(type: keyof typeof TimerType): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementPowerUnsetTimerRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPowerUnsetTimerRequest,
				timerType: type,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPowerUnsetTimerResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPowerUnsetTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getProprietaryTimers(): Promise<IProprietaryTimer[]> {
		const command = await this.timingCommandManagement.create<ManagementPowerGetProprietaryTimersRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPowerGetProprietaryTimersRequest,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPowerGetProprietaryTimersResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPowerGetProprietaryTimersResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async setProprietaryTimer(
		type: keyof typeof TimerType,
		timeOn: string | null,
		timeOff: string | null,
		weekdays: string[],
		keepAppletRunning: boolean,
	): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementPowerSetProprietaryTimerRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPowerSetProprietaryTimerRequest,
				timerType: type,
				timeOn,
				timeOff,
				weekdays,
				keepAppletRunning,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPowerSetProprietaryTimerResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPowerSetProprietaryTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async unsetProprietaryTimer(type: keyof typeof TimerType): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementPowerUnsetProprietaryTimerRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementPowerUnsetProprietaryTimerRequest,
				timerType: type,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementPowerUnsetProprietaryTimerResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementPowerUnsetProprietaryTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
