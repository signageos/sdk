import { DeviceActionType } from "./enums";
import { IDeviceUids, IFilter, IRollingUpdate, LogData } from "./types";

export interface IBulkOperationFilter {
	limit?: number;
	offset?: number;
}

export interface IBulkOperationCreatable<T extends DeviceActionType> {
	name?: string;
	filter: IFilter;
	schedule?: {
		datetime: Date;
		timezone?: string;
		/** Resolve filter at the time of execution instead of creation time */
		deferFilter?: boolean;
	};
	rollingUpdate?: IRollingUpdate;
	operationType: T;
	data: LogData[T];
	isDraft?: boolean;
}

export default interface IBulkOperation<T extends DeviceActionType> {
	uid: string;
	name: string | null;
	filter: IFilter;
	deviceUids: IDeviceUids[];
	failedDeviceUids: string[];
	successfulDeviceUids: string[];
	skippedDeviceUids: string[];
	createdAt: string | null;
	pausedAt?: string | null;
	stoppedAt?: string | null;
	resumedAt?: string | null;
	archivedAt?: string | null;
	finishedAt?: string | null;
	isRunning?: boolean;
	schedule?: {
		datetime: Date,
		timezone: string,
		deferFilter?: boolean,
	};
	rollingUpdate?: IRollingUpdate;
	operationType: T;
	data: LogData[T];
	progress: {
		total: number,
		failed: number,
		inProgress: number,
		succeeded: number,
	};
	organizationUids: string[];
	isDraft?: boolean;
}
