
export interface IDeviceVolumeUpdatable {
	volume: number;
}

export interface IDeviceVolume extends IDeviceVolumeUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceVolume;
