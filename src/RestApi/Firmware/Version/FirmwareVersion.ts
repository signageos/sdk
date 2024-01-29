import { fillDataToEntity } from '../../mapper';
import IFirmwareVersion from './IFirmwareVersion';

export default class FirmwareVersion implements IFirmwareVersion {
	public readonly uid: IFirmwareVersion['uid'];
	public readonly applicationType: IFirmwareVersion['applicationType'];
	public readonly type: IFirmwareVersion['type'];
	public readonly version: IFirmwareVersion['version'];
	public readonly uploaded: IFirmwareVersion['uploaded'];
	public readonly createdAt: IFirmwareVersion['createdAt'];
	public readonly files: IFirmwareVersion['files'];

	constructor(data: IFirmwareVersion) {
		fillDataToEntity(this, data);
	}
}
