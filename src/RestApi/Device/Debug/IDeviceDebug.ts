
export interface IDeviceDebugUpdatable {
	appletEnabled: boolean;
	nativeEnabled: boolean;
}

export interface IDeviceDebug extends IDeviceDebugUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceDebug;
