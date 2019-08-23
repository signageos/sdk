
export interface IDevicePackageUpdatable {
	packageName: string;
	version: string;
	build: string;
}

export interface IDevicePackage extends IDevicePackageUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
	postponedAt: Date | null;
}

export default IDevicePackage;
