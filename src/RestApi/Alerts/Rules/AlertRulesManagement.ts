import IOptions from '../../IOptions';
import { getResource, parseJSONResponse, postResource, putResource } from '../../requester';
import IAlertRule, { IAlertRuleCreatable, IAlertRuleUpdateable } from './IAlertRule';
import AlertRule from './AlertRule';
import IAlertRuleFilter from './IAlertRuleFilter';

export const RESOURCE: string = 'alert-rule';

export default class AlertRulesManagement {
	constructor(protected options: IOptions) {}

	public async list(filter: IAlertRuleFilter = {}): Promise<IAlertRule[]> {
		const response = await getResource(this.options, RESOURCE, filter);
		const data: IAlertRule[] = await parseJSONResponse(response);
		return data.map((item: IAlertRule) => new AlertRule(item));
	}

	public async get(alertRuleUid: string): Promise<IAlertRule> {
		const response = await getResource(this.options, `${RESOURCE}/${alertRuleUid}`);
		const data: IAlertRule = await parseJSONResponse(response);
		return new AlertRule(data);
	}

	public async create(settings: IAlertRuleCreatable): Promise<IAlertRule> {
		const { headers } = await postResource(this.options, RESOURCE, JSON.stringify(settings));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${RESOURCE}.`);
		}

		const locationParts = headerLocation.split('/');
		const alertRuleUid = locationParts[locationParts.length - 1];
		return this.get(alertRuleUid);
	}

	public async update(alertRuleUid: string, settings: IAlertRuleUpdateable): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertRuleUid}`, JSON.stringify(settings));
	}

	public async archive(alertRuleUid: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertRuleUid}/archive`, JSON.stringify({ alertRuleUid }));
	}

	public async pause(alertRuleUid: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertRuleUid}/pause`, JSON.stringify({ alertRuleUid }));
	}

	public async unpause(alertRuleUid: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertRuleUid}/unpause`, JSON.stringify({ alertRuleUid }));
	}
}
