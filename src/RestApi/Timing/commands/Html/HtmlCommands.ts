import { HtmlSnapshotTaken, TakeHtmlSnapshot } from '@signageos/front-applet/es6/Monitoring/Html/htmlCommands';
import { JSDOM } from 'jsdom';
import wait from '../../../../Timer/wait';
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

export interface IHtml {
	/** @returns Promise<[HTMLDocument](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDocument)> */
	getDOMDocument(): Promise<HTMLDocument>;
}

export default class HtmlCommands implements IHtml {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async getDOMDocument(): Promise<HTMLDocument> {
		const takeHtmlSnapshotCommand = await this.appletCommandManagement.send<TakeHtmlSnapshot>(this.deviceUid, this.appletUid, {
			command: {
				type: TakeHtmlSnapshot,
			},
		});
		while (true) {
			const timingCommands = await this.appletCommandManagement.list<HtmlSnapshotTaken>(this.deviceUid, this.appletUid, {
				receivedSince: takeHtmlSnapshotCommand.receivedAt,
				type: HtmlSnapshotTaken,
			});
			if (timingCommands.length > 0) {
				return new JSDOM(timingCommands[0].command.html).window.document;
			}
			await wait(500);
		}
	}
}
