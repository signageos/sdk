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
import wait from '../../../../Timer/wait';
import { ITimer, TimerType } from '@signageos/front-applet/es6/FrontApplet/Management/helpers/TimerHelper';
import { IProprietaryTimer } from '@signageos/front-applet/es6/FrontApplet/Management/helpers/ProprietaryTimerHelper';
import waitUntil from '../../../../Timer/waitUntil';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

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
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async systemReboot(): Promise<void> {
		const command = await this.appletCommandManagement.send<PowerSystemRebootRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: PowerSystemRebootRequest,
			},
		});
		return waitUntil(async () => {
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
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<PowerAppRestartResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: PowerAppRestartResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getTimers(): Promise<ITimer[]> {
		const command = await this.appletCommandManagement.send<ManagementPowerGetTimersRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerGetTimersRequest,
			},
		});
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerGetTimersResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
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
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerSetTimerResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPowerSetTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async unsetTimer(type: keyof typeof TimerType): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerUnsetTimerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerUnsetTimerRequest,
				timerType: type,
			},
		});
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<ManagementPowerUnsetTimerResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementPowerUnsetTimerResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getProprietaryTimers(): Promise<IProprietaryTimer[]> {
		const command = await this.appletCommandManagement.send<ManagementPowerGetProprietaryTimersRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerGetProprietaryTimersRequest,
			},
		});
		while (true) {
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
		while (true) {
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
			await wait(500);
		}
	}

	public async unsetProprietaryTimer(type: keyof typeof TimerType): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementPowerUnsetProprietaryTimerRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementPowerUnsetProprietaryTimerRequest,
				timerType: type,
			},
		});
		while (true) {
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
			await wait(500);
		}
	}
}
