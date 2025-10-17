import { Dependencies } from '../../Dependencies';
import { getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import IAlertRule, { IAlertRuleCreatable, IAlertRuleUpdateable } from './IAlertRule';
import AlertRule from './AlertRule';
import IAlertRuleFilter from './IAlertRuleFilter';
import { PaginatedList } from '../../../Lib/Pagination/PaginatedList';

export const RESOURCE: string = 'alert-rule';

export default class AlertRulesManagement {
	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter: IAlertRuleFilter = {}): Promise<PaginatedList<AlertRule>> {
		const response = await getResource(this.dependencies.options, RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(response, (item: IAlertRule) => new AlertRule(item));
	}

	public async get(alertRuleUid: string): Promise<IAlertRule> {
		const response = await getResource(this.dependencies.options, `${RESOURCE}/${alertRuleUid}`);
		const data: IAlertRule = await parseJSONResponse(response);
		return new AlertRule(data);
	}

	public async create(settings: IAlertRuleCreatable): Promise<IAlertRule> {
		const { headers } = await postResource(this.dependencies.options, RESOURCE, JSON.stringify(settings));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${RESOURCE}.`);
		}

		const locationParts = headerLocation.split('/');
		const alertRuleUid = locationParts[locationParts.length - 1];
		return this.get(alertRuleUid);
	}

	public async update(alertRuleUid: string, settings: IAlertRuleUpdateable): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertRuleUid}`, JSON.stringify(settings));
	}

	public async archive(alertRuleUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertRuleUid}/archive`, JSON.stringify({ alertRuleUid }));
	}

	public async pause(alertRuleUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertRuleUid}/pause`, JSON.stringify({ alertRuleUid }));
	}

	public async unpause(alertRuleUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertRuleUid}/unpause`, JSON.stringify({ alertRuleUid }));
	}
}
