import { fillDataToEntity } from '../../../mapper';
import IReportFile from './IReportFile';

export default class ReportFile implements IReportFile {
	// public readonly [P in keyof IReportFile]: IReportFile[P]; // Generalized TS doesn't support
	public readonly deviceUid: IReportFile['deviceUid'];
	public readonly type: IReportFile['type'];
	public readonly urn: IReportFile['urn'];
	public readonly uri: IReportFile['uri'];
	public readonly createdAt: IReportFile['createdAt'];

	constructor(data: IReportFile) {
		fillDataToEntity(this, data);
	}
}
