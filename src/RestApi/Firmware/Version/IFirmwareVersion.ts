
export interface IFirmwareVersionUpdatable {
	confirmed: boolean;
}

export interface IFirmwareVersionCreatable {
	applicationType: string;
	version: string;
	hash: string;
}

export interface IFirmwareVersion extends IFirmwareVersionUpdatable, IFirmwareVersionCreatable {
	uid: string;
	createdAt: Date;
}

export default IFirmwareVersion;
