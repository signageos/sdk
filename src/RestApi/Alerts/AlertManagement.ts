import { Dependencies } from '../Dependencies';
import AlertRulesManagement from './Rules/AlertRulesManagement';
import IAlert, { AlertSnooze, DeviceAlertSnooze, IAlertCreatable } from './IAlert';
import { deleteResource, getResource, parseJSONResponse, postResource, putResource } from '../requester';
import Alert from './Alert';
import IAlertFilter from './IAlertFilter';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

export const RESOURCE: string = 'alert';

export default class AlertManagement {
	public rules: AlertRulesManagement;

	constructor(private readonly dependencies: Dependencies) {
		this.rules = new AlertRulesManagement(dependencies);
	}

	public async list(filter: IAlertFilter = {}): Promise<PaginatedList<Alert>> {
		const response = await getResource(this.dependencies.options, RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(response, (item: IAlert) => new Alert(item));
	}

	public async get(alertUid: string): Promise<IAlert> {
		const response = await getResource(this.dependencies.options, `${RESOURCE}/${alertUid}`);
		const data: IAlert = await parseJSONResponse(response);
		return new Alert(data);
	}

	/**
	 * This request can be used only by admins.
	 * @param settings Properties of new alert
	 */
	public async create(settings: IAlertCreatable): Promise<IAlert> {
		const { headers } = await postResource(this.dependencies.options, RESOURCE, JSON.stringify(settings));
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${RESOURCE}.`);
		}

		const locationParts = headerLocation.split('/');
		const alertUid = locationParts[locationParts.length - 1];
		return this.get(alertUid);
	}

	public async updateDescription(alertUid: string, description: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertUid}`, JSON.stringify({ description }));
	}

	public async archive(alertUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertUid}/archive`, JSON.stringify({ alertUid }));
	}

	public async unarchive(alertUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertUid}/unarchive`, JSON.stringify({ alertUid }));
	}

	public async snooze(alertUid: string, settings: AlertSnooze): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertUid}/snooze`, JSON.stringify(settings));
	}

	public async unsnooze(alertUid: string): Promise<void> {
		await putResource(this.dependencies.options, `${RESOURCE}/${alertUid}/unsnooze`, JSON.stringify({ alertUid }));
	}

	public async snoozeDevice(alertUid: string, deviceUid: string, settings: DeviceAlertSnooze): Promise<void> {
		await postResource(this.dependencies.options, `${RESOURCE}/${alertUid}/${deviceUid}/device-snooze`, JSON.stringify(settings));
	}

	public async unsnoozeDevice(alertUid: string, deviceUid: string): Promise<void> {
		await deleteResource(this.dependencies.options, `${RESOURCE}/${alertUid}/${deviceUid}/device-snooze`);
	}
}
