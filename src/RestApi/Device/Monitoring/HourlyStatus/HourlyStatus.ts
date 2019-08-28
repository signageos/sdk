import IHourlyStatus from "./IHourlyStatus";

export default class HourlyStatus implements IHourlyStatus {

	// public readonly [P in keyof IHourlyStatus]: IHourlyStatus[P]; // Generalized TS doesn't support
	public readonly uid: IHourlyStatus['uid'];
	public readonly createdAt: IHourlyStatus['createdAt'];
	public readonly deviceIdentityHash: IHourlyStatus['deviceIdentityHash'];
	public readonly from: IHourlyStatus['from'];
	public readonly to: IHourlyStatus['to'];
	public readonly time: IHourlyStatus['time'];

	constructor(data: IHourlyStatus) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
