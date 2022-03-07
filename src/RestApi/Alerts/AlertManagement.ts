import IOptions from "../IOptions";
import AlertRulesManagement from "./Rules/AlertRulesManagement";
import IAlert, { AlertSnooze, IAlertCreatable } from "./IAlert";
import { getResource, parseJSONResponse, postResource, putResource } from "../requester";
import Alert from "./Alert";
import IAlertFilter from "./IAlertFilter";

export const RESOURCE: string = 'alert';

export default class AlertManagement {

	public rules: AlertRulesManagement;

	constructor(private options: IOptions) {
		this.rules = new AlertRulesManagement(options);
	}

	public async list(filter: IAlertFilter = {}): Promise<IAlert[]> {
		const response = await getResource(this.options, RESOURCE, filter);
		const data: IAlert[] = await parseJSONResponse(response);
		return data.map((item: IAlert) => new Alert(item));
	}

	public async get(alertUid: string): Promise<IAlert> {
		const response = await getResource(this.options, `${RESOURCE}/${alertUid}`);
		const data: IAlert = await parseJSONResponse(response);
		return new Alert(data);
	}

	/**
	 * This request can be used only by admins.
	 * @param settings Properties of new alert
	 */
	public async create(settings: IAlertCreatable): Promise<IAlert> {
		const { headers } = await postResource(this.options, RESOURCE, JSON.stringify(settings));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${RESOURCE}.`);
		}

		const locationParts = headerLocation.split('/');
		const alertUid = locationParts[locationParts.length - 1];
		return this.get(alertUid);
	}

	public async updateDescription(alertUid: string, description: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertUid}`, JSON.stringify({ description }));
	}

	public async archive(alertUid: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertUid}/archive`, JSON.stringify({ alertUid }));
	}

	public async unarchive(alertUid: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertUid}/unarchive`, JSON.stringify({ alertUid }));
	}

	public async snooze(alertUid: string, settings: AlertSnooze): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertUid}/snooze`, JSON.stringify(settings));
	}

	public async unsnooze(alertUid: string): Promise<void> {
		await putResource(this.options, `${RESOURCE}/${alertUid}/unsnooze`, JSON.stringify({ alertUid }));
	}
}
