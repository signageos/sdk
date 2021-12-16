import { fillDataToEntity } from "../mapper";
import IDevice from "./IDevice";

export default class Device implements IDevice {

	// public readonly [P in keyof IDevice]: IDevice[P]; // Generalized TS doesn't support
	public readonly uid: IDevice['uid'];
	public readonly name: IDevice['name'];
	public readonly createdAt: IDevice['createdAt'];
	public readonly aliveAt: IDevice['aliveAt'];
	public readonly pinCode: IDevice['pinCode'];
	public readonly applicationType: IDevice['applicationType'];
	public readonly applicationVersion: IDevice['applicationVersion'];
	public readonly frontDisplayVersion: IDevice['frontDisplayVersion'];
	public readonly firmwareVersion: IDevice['firmwareVersion'];
	public readonly model: IDevice['model'];
	public readonly serialNumber: IDevice['serialNumber'];
	public readonly timezone: IDevice['timezone'];
	public readonly organizationUid: IDevice['organizationUid'];
	public readonly networkInterfaces: IDevice['networkInterfaces'];
	public readonly storageStatus: IDevice['storageStatus'];
	public readonly connections: IDevice['connections'];
	public readonly batteryStatus: IDevice['batteryStatus'];
	public readonly currentTime: IDevice['currentTime'];

	constructor(data: IDevice) {
		fillDataToEntity(this, data);
	}
}
