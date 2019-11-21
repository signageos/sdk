import IFirmwareVersion from "./IFirmwareVersion";

export default class FirmwareVersion implements IFirmwareVersion {

	public readonly uid: IFirmwareVersion['uid'];
	public readonly applicationType: IFirmwareVersion['applicationType'];
	public readonly version: IFirmwareVersion['version'];
	public readonly confirmed: IFirmwareVersion['confirmed'];
	public readonly createdAt: IFirmwareVersion['createdAt'];
	public readonly hash: IFirmwareVersion['hash'];

	constructor(data: IFirmwareVersion) {
		for (const key in data) {
			// @ts-ignore copy all values
			this[key] = data[key];
		}
	}
}
