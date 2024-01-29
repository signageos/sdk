export interface IDeviceRemoteControlUpdatable {
	enabled: boolean;
}

export interface IDeviceRemoteControl extends IDeviceRemoteControlUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceRemoteControl;
