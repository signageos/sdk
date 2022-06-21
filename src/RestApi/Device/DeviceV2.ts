import { fillDataToEntity } from '../mapper';

export interface IDeviceV2 {
	uid: string;
	name: string;
	createdAt: Date;
	applicationType: string;
	firmwareVersion: string;
	model: string;
	serialNumber: string;
	organizationUid: string;
	locationUid?: string;
}

export default class Device implements IDeviceV2 {
	// public readonly [P in keyof IDeviceV2]: IDeviceV2[P]; // Generalized TS doesn't support
	public readonly uid: IDeviceV2['uid'];
	public readonly name: IDeviceV2['name'];
	public readonly createdAt: IDeviceV2['createdAt'];
	public readonly applicationType: IDeviceV2['applicationType'];
	public readonly firmwareVersion: IDeviceV2['firmwareVersion'];
	public readonly model: IDeviceV2['model'];
	public readonly serialNumber: IDeviceV2['serialNumber'];
	public readonly organizationUid: IDeviceV2['organizationUid'];
	public readonly locationUid: IDeviceV2['locationUid'];

	constructor(data: IDeviceV2) {
		fillDataToEntity(this, data);
	}
}
