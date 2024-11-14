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
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import ITime, { DateTime, IGetTime } from "@signageos/front-applet/es6/FrontApplet/Management/Time/ITime";

export default class ManagementTimeCommands implements ITime {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async set(_currentDate: Date, _timezone: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async get(): Promise<IGetTime> {
		const command = await this.appletCommandManagement.send<ManagementTimeGetTimeRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementTimeGetTimeRequest,
			},
		});
		while (true) {
			const responseCommands = await this.appletCommandManagement.list<ManagementTimeGetTimeResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementTimeGetTimeResult,
			});
			if (responseCommands.length > 0) {
				return responseCommands[0].command.result;
			}
			await wait(500);
		}
	}

	/** @deprecated use setManual(dateTime: DateTime, timezone: string) instead */
	public async setManual(currentDate: Date, timezone: string): Promise<void>;
	public async setManual(dateTime: DateTime, timezone: string): Promise<void>;

	public async setManual(...args: [Date | DateTime, string]): Promise<void> {
		const [currentDate, timezone] = args;
		if (!(currentDate instanceof Date)) {
			const command = await this.appletCommandManagement.send<ManagementTimeSetManualRequest>(this.deviceUid, this.appletUid, {
				command: {
					type: ManagementTimeSetManualRequest,
					dateTime: currentDate,
					timezone,
				},
			});
			return waitUntil(async () => {
				const responseCommands = await this.appletCommandManagement.list<ManagementTimeSetManualResult>(this.deviceUid, this.appletUid, {
					receivedSince: command.receivedAt,
					type: ManagementTimeSetManualResult,
				});
				return responseCommands.length > 0;
			});
		} else {
			throw new Error('Method is deprecated');
		}
	}

	public async setNTP(ntpServer: string, timezone: string): Promise<void> {
		const command = await this.appletCommandManagement.send<ManagementTimeSetNTPRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: ManagementTimeSetNTPRequest,
				ntpServer,
				timezone,
			},
		});
		return waitUntil(async () => {
			const responseCommands = await this.appletCommandManagement.list<ManagementTimeSetNTPResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: ManagementTimeSetNTPResult,
			});
			return responseCommands.length > 0;
		});
	}
}
