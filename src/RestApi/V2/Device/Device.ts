import { fillDataToEntity } from '../../mapper';

export enum SocketDriver {
	Websocket = 'websocket',
	Http = 'http',
}

export interface IDevice {
	uid: string;
	name: string;
	createdAt: Date;
	applicationType: string;
	firmwareVersion: string;
	model: string;
	serialNumber: string;
	brand: string | null;
	osVersion: string | null;
	organizationUid: string;
	locationUid?: string;
	connectionMethod?: SocketDriver | null;
}

export interface IDeviceUpdatable {
	name?: string;
	connectionMethod?: SocketDriver;
}

export default class Device implements IDevice {
	// public readonly [P in keyof IDevice]: IDevice[P]; // Generalized TS doesn't support
	public readonly uid: IDevice['uid'];
	public readonly name: IDevice['name'];
	public readonly createdAt: IDevice['createdAt'];
	public readonly applicationType: IDevice['applicationType'];
	public readonly firmwareVersion: IDevice['firmwareVersion'];
	public readonly model: IDevice['model'];
	public readonly serialNumber: IDevice['serialNumber'];
	public readonly brand: IDevice['brand'];
	public readonly osVersion: IDevice['osVersion'];
	public readonly organizationUid: IDevice['organizationUid'];
	public readonly locationUid: IDevice['locationUid'];
	public readonly connectionMethod: IDevice['connectionMethod'];

	constructor(data: IDevice) {
		fillDataToEntity(this, data);
	}
}
