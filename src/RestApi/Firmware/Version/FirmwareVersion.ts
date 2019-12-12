import IFirmwareVersion from "./IFirmwareVersion";

export default class FirmwareVersion implements IFirmwareVersion {

	public readonly uid: IFirmwareVersion['uid'];
	public readonly applicationType: IFirmwareVersion['applicationType'];
	public readonly version: IFirmwareVersion['version'];
	public readonly uploaded: IFirmwareVersion['uploaded'];
	public readonly createdAt: IFirmwareVersion['createdAt'];
	public readonly files: IFirmwareVersion['files'];

	constructor(data: IFirmwareVersion) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
