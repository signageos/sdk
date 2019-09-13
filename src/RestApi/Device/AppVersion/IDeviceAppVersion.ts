
export interface IDeviceAppVersionUpdatable {
	version: string;
	applicationType: string;
}

export interface IDeviceAppVersion extends IDeviceAppVersionUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceAppVersion;
