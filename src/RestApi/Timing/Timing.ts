import * as _ from 'lodash';
import ITiming from './ITiming';
import TimingCommandManagement from './Command/TimingCommandManagement';
import { TimingLoaded } from '@signageos/front-applet/es6/Monitoring/Timing/timingCommands';
import {
	EnableMonitoring,
	DisableMonitoring,
	AppletRefreshRequest,
	AppletRefreshResult,
} from '@signageos/front-applet/es6/Monitoring/monitoringCommands';
import waitUntil from '../../Timer/waitUntil';
import TimingManagement from './TimingManagement';
import { ConsoleLogged } from '@signageos/front-applet/es6/Monitoring/Console/consoleCommands';
import TimingCommand from './Command/TimingCommand';
import { VideoStateChanged } from '@signageos/front-applet/es6/Monitoring/Video/videoCommands';
import IVideoProperties from '@signageos/front-applet/es6/FrontApplet/Video/IVideoProperties';
import { fillDataToEntity } from '../mapper';
import DisplayCommands, { IDisplay } from './commands/Display/DisplayCommands';
import OfflineCacheCommands, { IOfflineCache } from './commands/Offline/Cache/OfflineCacheCommands';
import OSDCommands, { IOsd } from './commands/OSD/OSDCommands';
import FileSystemCommands, { IFileSystem } from './commands/FileSystem/FileSystemCommands';
import ManagementCommands from './commands/Management/ManagementCommands';
import HtmlCommands, { IHtml } from './commands/Html/HtmlCommands';
import NativeMdcCommands, { INativeMdcCommands } from './commands/NativeCommands/Mdc/NativeMdcCommands';

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

type IVideoOperations = {
	getAll(since?: Date): Promise<IVideoProperties[]>;
};
/**
 * @description See the documentation [Video](https://developers.signageos.io/sdk/content/js-video)
 * <br>The difference from Applet SDK here is that the operations is not function but object with function `getAll()`
 * that returns all calls of the operation.
 */
export interface IVideo {
	play: IVideoOperations;
	stop: IVideoOperations;
	pause: IVideoOperations;
	ended: IVideoOperations;
	error: IVideoOperations;
}
const videoStates: VideoStateChanged['state'][] = ['play', 'stop', 'pause', 'ended', 'error'];

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

	public readonly display: IDisplay;
	public readonly offline: {
		cache: IOfflineCache;
	};
	public readonly osd: IOsd;
	public readonly fileSystem: IFileSystem;
	public readonly management: ManagementCommands;
	public readonly html: IHtml;
	public readonly native: {
		mdc: INativeMdcCommands;
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
						timingCommands.filter((timingCommand: TimingCommand<ConsoleLogged>) => timingCommand.command.level === level),
						(timingCommand: TimingCommand<ConsoleLogged>) => timingCommand.command.messages,
					);
				},
			},
		}),
		{},
	);
	/** @see IVideo */
	public readonly video: IVideo = videoStates.reduce<any>(
		(videoMemo: IVideo, state: VideoStateChanged['state']) => ({
			...videoMemo,
			[state]: {
				getAll: async (since: Date = this.updatedAt) => {
					const videoStateChangedCommands = await this.timingCommandManagement.getList<VideoStateChanged>({
						deviceUid: this.deviceUid,
						appletUid: this.appletUid,
						receivedSince: since.toISOString(),
						type: VideoStateChanged,
					});
					const videosByStateMap = _.groupBy(
						videoStateChangedCommands,
						(videoStateChangedCommand: TimingCommand<VideoStateChanged>) => videoStateChangedCommand.command.state,
					);
					const videosOfCurrentState = videosByStateMap[state].map((videoStateChangedCommand: TimingCommand<VideoStateChanged>) =>
						_.pick(videoStateChangedCommand.command, 'uri', 'x', 'y', 'width', 'height'),
					);
					return videosOfCurrentState;
				},
			},
		}),
		{},
	);

	constructor(
		data: ITiming,
		private timingManagement: TimingManagement,
		private timingCommandManagement: TimingCommandManagement,
	) {
		fillDataToEntity(this, data);
		this.display = new DisplayCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.offline = {
			cache: new OfflineCacheCommands(this.deviceUid, this.appletUid, this.timingCommandManagement),
		};
		this.osd = new OSDCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.fileSystem = new FileSystemCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.management = new ManagementCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.html = new HtmlCommands(this.deviceUid, this.appletUid, this.timingCommandManagement);
		this.native = {
			mdc: new NativeMdcCommands(this.deviceUid, this.appletUid, this.timingCommandManagement),
		};
	}

	/**
	 * @description Wait until the timing is loaded
	 * @param since Date to wait for the timing to be loaded
	 */
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

	/**
	 * @description Refresh the applet in timing
	 */
	public async refresh() {
		const command = await this.timingCommandManagement.create<AppletRefreshRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: AppletRefreshRequest,
			},
		});
		return waitUntil(async () => {
			const results = await this.timingCommandManagement.getList<AppletRefreshResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: AppletRefreshResult,
			});
			return results.length > 0;
		});
	}

	public async enableMonitoring() {
		await this.timingCommandManagement.create<EnableMonitoring>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: { type: EnableMonitoring },
		});
	}

	public async disableMonitoring() {
		await this.timingCommandManagement.create<DisableMonitoring>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: { type: DisableMonitoring },
		});
	}

	/**
	 * @description Delete the timing
	 */
	public async delete() {
		await this.timingManagement.delete(this.uid);
	}
}
