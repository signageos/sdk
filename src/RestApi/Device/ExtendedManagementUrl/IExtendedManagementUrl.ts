export interface IDeviceExtendedManagementUrlUpdatable {
	url: string;
}

export interface IDeviceExtendedManagementUrl extends IDeviceExtendedManagementUrlUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceExtendedManagementUrl;
