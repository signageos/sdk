import IReportFile from "./IReportFile";

export default class ReportFile implements IReportFile {

	// public readonly [P in keyof IReportFile]: IReportFile[P]; // Generalized TS doesn't support
	public readonly deviceUid: IReportFile['deviceUid'];
	public readonly type: IReportFile['type'];
	public readonly urn: IReportFile['urn'];
	public readonly uri: IReportFile['uri'];
	public readonly createdAt: IReportFile['createdAt'];

	constructor(data: IReportFile) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
