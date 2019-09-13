
export interface IDeviceDateTimeUpdatable {
	time: string;
	timezone: string;
}

export interface IDeviceDateTime {
	uid: string;
	timestamp: number;
	timezone: string;
	deviceUid: string;
	createdAt: Date;
	failedAt: Date | null;
}

export default IDeviceDateTime;
