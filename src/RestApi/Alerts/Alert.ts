import IAlert from './IAlert';
import { fillDataToEntity } from '../mapper';

export default class Alert implements IAlert {
	public readonly alertUid: IAlert['alertUid'];
	public readonly organizationUid: IAlert['organizationUid'];
	public readonly description: IAlert['description'];
	public readonly alertRuleUid: IAlert['alertRuleUid'];
	public readonly createdAt: IAlert['createdAt'];
	public readonly archivedAt: IAlert['archivedAt'];
	public readonly deviceUids: IAlert['deviceUids'];
	public readonly latelyChangedAt: IAlert['latelyChangedAt'];
	public readonly snoozeRule: IAlert['snoozeRule'];

	constructor(data: IAlert) {
		fillDataToEntity(this, data);
	}
}
