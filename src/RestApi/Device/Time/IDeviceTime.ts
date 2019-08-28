
export interface IDeviceTimeUpdatable {
	time: string;
	timezone: string;
}

export interface IDeviceTime {
	uid: string;
	timestamp: number;
	timezone: string;
	deviceUid: string;
	createdAt: Date;
	failedAt: Date | null;
}

export default IDeviceTime;
