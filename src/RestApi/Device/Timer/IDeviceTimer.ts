export enum DeviceTimerLevel {
	Native = 'NATIVE',
	Proprietary = 'PROPRIETARY',
}

export enum DeviceTimerType {
	Timer1 = 'TIMER_1',
	Timer2 = 'TIMER_2',
	Timer3 = 'TIMER_3',
	Timer4 = 'TIMER_4',
	Timer5 = 'TIMER_5',
	Timer6 = 'TIMER_6',
	Timer7 = 'TIMER_7',
}

export enum DeviceTimerWeekday {
	Monday = 'mon',
	Tuesday = 'tue',
	Wednesday = 'wed',
	Thursday = 'thu',
	Friday = 'fri',
	Saturday = 'sat',
	Sunday = 'sund',
}

export interface IDeviceTimerUpdatable {
	type: DeviceTimerType;
	level: DeviceTimerLevel;
	timeOn: string | null;
	timeOff: string | null;
	weekdays: DeviceTimerWeekday[];
	volume: number;
}

export interface IDeviceTimer extends IDeviceTimerUpdatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IDeviceTimer;
