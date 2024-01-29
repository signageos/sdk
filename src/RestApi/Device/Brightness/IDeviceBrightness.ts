export interface IDeviceBrightnessUpdatable {
	brightness1: number;
	timeFrom1: string;
	brightness2: number;
	timeFrom2: string;
}

export interface IDeviceBrightness extends IDeviceBrightnessUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceBrightness;
