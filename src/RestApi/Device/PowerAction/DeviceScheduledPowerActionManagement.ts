import { deleteResource, getResource, parseJSONResponse, postResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import IScheduledPowerAction, { IScheduledPowerActionCreatable } from './IScheduledPowerAction';
import ScheduledPowerAction from './ScheduledPowerAction';
import { Headers } from 'node-fetch';

export default class DeviceScheduledPowerActionManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/scheduled-power-action`;
	}

	private static getDetailUrl(deviceUid: string, scheduledPowerActionId: string): string {
		return DeviceScheduledPowerActionManagement.getUrl(deviceUid) + '/' + scheduledPowerActionId;
	}

	constructor(private options: IOptions) {}

	public async list(deviceUid: string): Promise<IScheduledPowerAction[]> {
		const response = await getResource(this.options, DeviceScheduledPowerActionManagement.getUrl(deviceUid));
		const data: IScheduledPowerAction[] = await parseJSONResponse(response);

		return data.map((item: IScheduledPowerAction) => new ScheduledPowerAction(item));
	}

	public async create(deviceUid: string, settings: IScheduledPowerActionCreatable): Promise<string> {
		const response = await postResource(this.options, DeviceScheduledPowerActionManagement.getUrl(deviceUid), JSON.stringify(settings));
		return this.extractLocationFromHeader(response.headers, "Api didn't return location header to created scheduled power action.");
	}

	public async get(deviceUid: string, sPowerActionId: string): Promise<IScheduledPowerAction> {
		const response = await getResource(this.options, DeviceScheduledPowerActionManagement.getDetailUrl(deviceUid, sPowerActionId));

		return new ScheduledPowerAction(await parseJSONResponse(response));
	}

	public async cancel(deviceUid: string, sPowerActionId: string): Promise<void> {
		await deleteResource(this.options, DeviceScheduledPowerActionManagement.getDetailUrl(deviceUid, sPowerActionId));
	}

	private async extractLocationFromHeader(headers: Headers, message: string) {
		const headerLocation = headers.get('location');

		if (!headerLocation) {
			throw new Error(message);
		}

		return headerLocation.split('/').slice(-1)[0];
	}
}
