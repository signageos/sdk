import { DisplaySupportsRequest, DisplaySupportsResult } from '@signageos/front-applet/es6/Monitoring/Display/displayCommands';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';
import IDisplay from "@signageos/front-applet/es6/FrontApplet/Display/IDisplay";

/**
 * @description See the documentation
 * [Display API](https://developers.signageos.io/sdk/content/js-display)
 */
export default class DisplayCommands implements IDisplay {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async supports(capability: string): Promise<boolean> {
		const supportsCommand = await this.appletCommandManagement.send<DisplaySupportsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: DisplaySupportsRequest,
				capability,
			},
		});
		while (true) {
			const supportsCommands = await this.appletCommandManagement.list<DisplaySupportsResult>(this.deviceUid, this.appletUid, {
				receivedSince: supportsCommand.receivedAt,
				type: DisplaySupportsResult,
			});
			if (supportsCommands.length > 0) {
				return supportsCommands[0].command.supports;
			}
			await wait(500);
		}
	}
}
