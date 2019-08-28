
export interface IDeviceFirmwareUpdatable {
	version: string;
}

export interface IDeviceFirmware extends IDeviceFirmwareUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
}

export default IDeviceFirmware;
