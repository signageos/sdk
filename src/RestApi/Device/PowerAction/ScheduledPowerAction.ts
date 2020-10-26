import IScheduledPowerAction from "./IScheduledPowerAction";

export default class ScheduledPowerAction implements IScheduledPowerAction {

	// public readonly [P in keyof IScheduledPowerAction]: IScheduledPowerAction[P]; // Generalized TS doesn't support
	public readonly uid: IScheduledPowerAction['uid'];
	public readonly deviceUid: IScheduledPowerAction['deviceUid'];
	public readonly powerAction: IScheduledPowerAction['powerAction'];
	public readonly weekdays: IScheduledPowerAction['weekdays'];
	public readonly time: IScheduledPowerAction['time'];
	public readonly createdAt: IScheduledPowerAction['createdAt'];
	public readonly succeededAt: IScheduledPowerAction['succeededAt'];
	public readonly failedAt: IScheduledPowerAction['failedAt'];

	constructor(data: IScheduledPowerAction) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
