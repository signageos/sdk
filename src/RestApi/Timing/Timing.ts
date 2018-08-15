
import ITiming from "./ITiming";
import TimingCommandManagement from "./Command/TimingCommandManagement";
import { TimingLoaded } from "@signageos/front-applet/dist/Monitoring/Timing/timingCommands";
import waitUntil from "../../Timer/waitUntil";

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

	constructor(
		timingData: ITiming,
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
}
