import { DeviceActionType } from "./enums";
import { DateFormat, IDeviceUids, IFilter, IRollingUpdate, LogData } from "./types";

export interface IBulkOperationFilter {
	limit?: number;
	offset?: number;
}

export interface IBulkOperationCreatable<T extends DeviceActionType> {
	name?: string;
	filter: IFilter;
	scheduleDate?: DateFormat;
	rollingUpdate?: IRollingUpdate;
	operationType: T;
	data: LogData[T];
}

export default interface IBulkOperation<T extends DeviceActionType> {
	uid: string;
	name: string | null;
	filter: IFilter;
	deviceUids: IDeviceUids[];
	failedDeviceUids: string[];
	successfulDeviceUids: string[];
	createdAt: string | null;
	pausedAt?: string | null;
	stoppedAt?: string | null;
	resumedAt?: string | null;
	archivedAt?: string | null;
	finishedAt?: string | null;
	isRunning?: boolean;
	scheduleDate?: string | null;
	rollingUpdate?: IRollingUpdate;
	operationType: T;
	data: LogData[T];
	progress: {
		total: number,
		failed: number,
		inProgress: number,
		succeeded: number,
	};
	organizationUid: string | undefined;
}
