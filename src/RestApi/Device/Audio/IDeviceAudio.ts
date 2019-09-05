
export interface IDeviceAudioUpdatable {
	volume: number;
}

export interface IDeviceAudio extends IDeviceAudioUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceAudio;
