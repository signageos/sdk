import { HtmlSnapshotTaken, TakeHtmlSnapshot } from '@signageos/front-applet/es6/Monitoring/Html/htmlCommands';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import { JSDOM } from 'jsdom';
import wait from '../../../../Timer/wait';

export interface IHtml {
	/** @returns Promise<[HTMLDocument](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDocument)> */
	getDOMDocument(): Promise<HTMLDocument>;
}

export default class HtmlCommands implements IHtml {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async getDOMDocument(): Promise<HTMLDocument> {
		const takeHtmlSnapshotCommand = await this.timingCommandManagement.create<TakeHtmlSnapshot>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: TakeHtmlSnapshot,
			},
		});
		while (true) {
			const timingCommands = await this.timingCommandManagement.getList<HtmlSnapshotTaken>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: takeHtmlSnapshotCommand.receivedAt.toISOString(),
				type: HtmlSnapshotTaken,
			});
			if (timingCommands.length > 0) {
				return new JSDOM(timingCommands[0].command.html).window.document;
			}
			await wait(500);
		}
	}
}
