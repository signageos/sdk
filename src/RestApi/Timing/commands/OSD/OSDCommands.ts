import { ShowOSDRequest, ShowOSDResult } from '@signageos/front-applet/es6/Monitoring/OSD/osdCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IOSD from "@signageos/front-applet/es6/FrontApplet/OSD/IOSD";

/**
 * @description See the documentation
 * [OSD API](https://developers.signageos.io/sdk/content/js-osd)
 */
export default class OSDCommands implements IOSD {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async showOSD(): Promise<void> {
		const showOsdCommand = await this.appletCommandManagement.send<ShowOSDRequest>(this.deviceUid, this.appletUid, {
			command: { type: ShowOSDRequest },
		});
		while (true) {
			const showOsdCommands = await this.appletCommandManagement.list<ShowOSDResult>(this.deviceUid, this.appletUid, {
				receivedSince: showOsdCommand.receivedAt,
				type: ShowOSDResult,
			});
			if (showOsdCommands.length > 0) {
				return showOsdCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
