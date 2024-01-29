import { DevicePowerAction } from './IPowerAction';

export enum SheduledActionDay {
	Monday = 'MONDAY',
	Tuesday = 'TUESDAY',
	Wednesday = 'WEDNESDAY',
	Thursday = 'THURSDAY',
	Friday = 'FRIDAY',
	Saturday = 'SATURDAY',
	Sunday = 'SUNDAY',
}

export interface IScheduledPowerActionCreatable {
	powerAction: DevicePowerAction;
	weekdays: SheduledActionDay[];
	time: string;
}

export interface IScheduledPowerAction extends IScheduledPowerActionCreatable {
	uid: string;
	deviceUid: string;
	createdAt: Date;
	succeededAt: Date | null;
	failedAt: Date | null;
}

export default IScheduledPowerAction;
