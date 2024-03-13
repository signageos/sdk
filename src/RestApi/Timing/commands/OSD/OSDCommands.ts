import { ShowOSDRequest, ShowOSDResult } from '@signageos/front-applet/es6/Monitoring/OSD/osdCommands';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import wait from '../../../../Timer/wait';

export interface IOsd {
	showOSD(): Promise<void>;
}

/**
 * @description See the documentation
 * [OSD API](https://developers.signageos.io/sdk/content/js-osd)
 */
export default class OSDCommands implements IOsd {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async showOSD(): Promise<void> {
		const showOsdCommand = await this.timingCommandManagement.create<ShowOSDRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: ShowOSDRequest,
			},
		});
		while (true) {
			const showOsdCommands = await this.timingCommandManagement.getList<ShowOSDResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: showOsdCommand.receivedAt.toISOString(),
				type: ShowOSDResult,
			});
			if (showOsdCommands.length > 0) {
				return showOsdCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
