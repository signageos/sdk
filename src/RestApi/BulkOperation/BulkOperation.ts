import { fillDataToEntity } from '../mapper';
import IBulkOperation from './IBulkOperation';
import { DeviceActionType } from './BulkOperation.enums';

type IBulkOperationAlias = IBulkOperation<DeviceActionType>;

export default class BulkOperation implements IBulkOperationAlias {
	public readonly uid: IBulkOperationAlias['uid'];
	public readonly name: IBulkOperationAlias['name'];
	public readonly filter: IBulkOperationAlias['filter'];
	public readonly deviceUids: IBulkOperationAlias['deviceUids'];
	public readonly failedDeviceUids: IBulkOperationAlias['failedDeviceUids'];
	public readonly successfulDeviceUids: IBulkOperationAlias['successfulDeviceUids'];
	public readonly skippedDeviceUids: IBulkOperationAlias['skippedDeviceUids'];
	public readonly createdAt: IBulkOperationAlias['createdAt'];
	public readonly pausedAt: IBulkOperationAlias['pausedAt'];
	public readonly stoppedAt: IBulkOperationAlias['stoppedAt'];
	public readonly resumedAt: IBulkOperationAlias['resumedAt'];
	public readonly archivedAt: IBulkOperationAlias['archivedAt'];
	public readonly finishedAt: IBulkOperationAlias['finishedAt'];
	public readonly isRunning: IBulkOperationAlias['isRunning'];
	public readonly schedule: IBulkOperationAlias['schedule'];
	public readonly rollingUpdate: IBulkOperationAlias['rollingUpdate'];
	public readonly operationType: IBulkOperationAlias['operationType'];
	public readonly data: IBulkOperationAlias['data'];
	public readonly progress: IBulkOperationAlias['progress'];
	public readonly organizationUids: IBulkOperationAlias['organizationUids'];
	public readonly isDraft: IBulkOperationAlias['isDraft'];

	constructor(data: IBulkOperationAlias) {
		fillDataToEntity(this, data);
	}
}
