import { DisplaySupportsRequest, DisplaySupportsResult } from '@signageos/front-applet/es6/Monitoring/Display/displayCommands';
import wait from '../../../../Timer/wait';
import TimingCommandManagement from '../../Command/TimingCommandManagement';

export interface IDisplay {
	supports(capability: string): Promise<boolean>;
}

/**
 * @description See the documentation
 * [Display API](https://developers.signageos.io/sdk/content/js-display)
 */
export default class DisplayCommands implements IDisplay {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async supports(capability: string): Promise<boolean> {
		const supportsCommand = await this.timingCommandManagement.create<DisplaySupportsRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: DisplaySupportsRequest,
				capability,
			},
		});
		while (true) {
			const supportsCommands = await this.timingCommandManagement.getList<DisplaySupportsResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: supportsCommand.receivedAt.toISOString(),
				type: DisplaySupportsResult,
			});
			if (supportsCommands.length > 0) {
				return supportsCommands[0].command.supports;
			}
			await wait(500);
		}
	}
}
