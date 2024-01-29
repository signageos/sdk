import IAlertRule from './IAlertRule';
import { fillDataToEntity } from '../../mapper';

export default class AlertRule implements IAlertRule {
	public readonly alertRuleUid: IAlertRule['alertRuleUid'];
	public readonly name: IAlertRule['name'];
	public readonly description: IAlertRule['description'];
	public readonly alertType: IAlertRule['alertType'];
	public readonly companyUid: IAlertRule['companyUid'];
	public readonly createdAt: IAlertRule['createdAt'];
	public readonly archivedAt: IAlertRule['archivedAt'];
	public readonly pausedAt: IAlertRule['pausedAt'];
	public readonly filter: IAlertRule['filter'];
	public readonly conditions: IAlertRule['conditions'];
	public readonly organizationUids: IAlertRule['organizationUids'];
	public readonly threshold: IAlertRule['threshold'];
	public readonly periodicity: IAlertRule['periodicity'];
	public readonly action: IAlertRule['action'];

	constructor(data: IAlertRule) {
		fillDataToEntity(this, data);
	}
}
