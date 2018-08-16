
import { JSDOM } from 'jsdom';
import * as _ from 'lodash';
import ITiming from "./ITiming";
import TimingCommandManagement from "./Command/TimingCommandManagement";
import { TimingLoaded } from "@signageos/front-applet/dist/Monitoring/Timing/timingCommands";
import waitUntil from "../../Timer/waitUntil";
import TimingManagement from "./TimingManagement";
import { HtmlSnapshotTaken, TakeHtmlSnapshot } from "@signageos/front-applet/dist/Monitoring/Html/htmlCommands";
import wait from "../../Timer/wait";
import { ConsoleLogged } from '@signageos/front-applet/dist/Monitoring/Console/consoleCommands';
import TimingCommand from './Command/TimingCommand';

export interface IHtml {
	getDOMDocument(): Promise<HTMLDocument>;
}

type ILogOperations = {
	getAll(since?: Date): Promise<string[]>;
};
export interface IConsole {
	log: ILogOperations;
	error: ILogOperations;
	warn: ILogOperations;
	info: ILogOperations;
	debug: ILogOperations;
}

export default class Timing implements ITiming {

	// public readonly [P in keyof ITiming]: ITiming[P]; // Generalized TS doesn't support
	public readonly uid: ITiming['uid'];
	public readonly createdAt: ITiming['createdAt'];
	public readonly updatedAt: ITiming['updatedAt'];
	public readonly deviceUid: ITiming['deviceUid'];
	public readonly appletUid: ITiming['appletUid'];
	public readonly appletVersion: ITiming['appletVersion'];
	public readonly startsAt: ITiming['startsAt'];
	public readonly endsAt: ITiming['endsAt'];
	public readonly configuration: ITiming['configuration'];
	public readonly position: ITiming['position'];
	public readonly finishEvent: ITiming['finishEvent'];

	public readonly html: IHtml = {
		getDOMDocument: async () => {
			const takeHtmlSnapshotCommand = await this.timingCommandManagement.create<TakeHtmlSnapshot>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
					type: TakeHtmlSnapshot,
				}
			});
			while (true) {
				const timingCommands = await this.timingCommandManagement.getList<HtmlSnapshotTaken>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					receivedSince: takeHtmlSnapshotCommand.receivedAt.toISOString(),
					type: HtmlSnapshotTaken,
				});
				if (timingCommands.length > 0) {
					return new JSDOM(timingCommands[0].commandPayload.html).window.document;
				}
				await wait(500);
			}
		},
	};
	public readonly console: IConsole = ['log', 'error', 'warn', 'info', 'debug'].reduce<any>(
		(consoleMemo: IConsole, level: string) => ({
			...consoleMemo,
			[level]: {
				getAll: async (since: Date = this.updatedAt) => {
					const timingCommands = await this.timingCommandManagement.getList<ConsoleLogged>({
						deviceUid: this.deviceUid,
						appletUid: this.appletUid,
						receivedSince: since.toISOString(),
						type: ConsoleLogged,
					});
					return _.flatMap(
						timingCommands
							.filter((timingCommand: TimingCommand<ConsoleLogged>) => timingCommand.commandPayload.level === level),
						(timingCommand: TimingCommand<ConsoleLogged>) => timingCommand.commandPayload.messages,
					);
				},
			}
		}),
		{},
	);

	constructor(
		timingData: ITiming,
		private timingManagement: TimingManagement,
		private timingCommandManagement: TimingCommandManagement,
	) {
		for (const key in timingData) {
			// @ts-ignore copy all values
			this[key] = timingData[key];
		}
	}

	public async onLoaded(since: Date = this.updatedAt) {
		return waitUntil(async () => {
			const timingCommands = await this.timingCommandManagement.getList<TimingLoaded>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: since.toISOString(),
				type: TimingLoaded,
			});
			return timingCommands.length > 0;
		});
	}

	public async delete() {
		await this.timingManagement.delete(this.uid);
	}
}
