import TimingCommandManagement from '../../Command/TimingCommandManagement';
import { DateTime, IGetTime } from '@signageos/front-applet/es6/FrontApplet/Management/Time';
import {
	ManagementTimeGetTimeRequest,
	ManagementTimeGetTimeResult,
	ManagementTimeSetManualRequest,
	ManagementTimeSetManualResult,
	ManagementTimeSetNTPRequest,
	ManagementTimeSetNTPResult,
} from '@signageos/front-applet/es6/Monitoring/Management/Time/timeCommands';
import wait from '../../../../Timer/wait';
import waitUntil from '../../../../Timer/waitUntil';

export interface IManagementTime {
	get(): Promise<IGetTime>;
	setManual(dateTime: DateTime, timezone: string): Promise<void>;
	setNTP(ntpServer: string, timezone: string): Promise<void>;
}

export default class ManagementTimeCommands implements IManagementTime {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async get(): Promise<IGetTime> {
		const command = await this.timingCommandManagement.create<ManagementTimeGetTimeRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementTimeGetTimeRequest,
			},
		});
		while (true) {
			const responseCommands = await this.timingCommandManagement.getList<ManagementTimeGetTimeResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementTimeGetTimeResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async setManual(dateTime: DateTime, timezone: string): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementTimeSetManualRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementTimeSetManualRequest,
				dateTime,
				timezone,
			},
		});
		return waitUntil(async () => {
			const responseCommands = await this.timingCommandManagement.getList<ManagementTimeSetManualResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementTimeSetManualResult,
			});
			return responseCommands.length > 0;
		});
	}

	public async setNTP(ntpServer: string, timezone: string): Promise<void> {
		const command = await this.timingCommandManagement.create<ManagementTimeSetNTPRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ManagementTimeSetNTPRequest,
				ntpServer,
				timezone,
			},
		});
		return waitUntil(async () => {
			const responseCommands = await this.timingCommandManagement.getList<ManagementTimeSetNTPResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: ManagementTimeSetNTPResult,
			});
			return responseCommands.length > 0;
		});
	}
}
