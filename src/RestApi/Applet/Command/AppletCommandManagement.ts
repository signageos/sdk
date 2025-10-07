import { getResource, parseJSONResponse, postResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import { RESOURCE as APPLET } from '../AppletManagement';
import IAppletCommandFilter from './IAppletCommandFilter';
import IAppletCommand, { IAppletCommandSendable } from './IAppletCommand';
import AppletCommand from './AppletCommand';
import { ITimingCommandPayload } from '../../Timing/Command/ITimingCommand';
import wait from '../../../Timer/wait';
import RequestError from '../../Error/RequestError';

export default class AppletCommandManagement {
	constructor(private options: IOptions) {}

	public async list<TCommandPayload extends ITimingCommandPayload>(
		deviceUid: string,
		appletUid: string,
		filter: IAppletCommandFilter = {},
	): Promise<IAppletCommand<TCommandPayload>[]> {
		const response = await getResource(this.options, AppletCommandManagement.getResource(deviceUid, appletUid), filter);
		const data: IAppletCommand<TCommandPayload>[] = await parseJSONResponse(response);

		return data.map((item: IAppletCommand<TCommandPayload>) => new AppletCommand<TCommandPayload>(item));
	}

	public async get<TCommandPayload extends ITimingCommandPayload>(
		deviceUid: string,
		appletUid: string,
		commandUid: string,
	): Promise<IAppletCommand<TCommandPayload>> {
		const url = AppletCommandManagement.getResource(deviceUid, appletUid) + '/' + commandUid;
		const response = await getResource(this.options, url);

		return new AppletCommand<TCommandPayload>(await parseJSONResponse(response));
	}

	public async send<TCommandPayload extends ITimingCommandPayload>(
		deviceUid: string,
		appletUid: string,
		settings: IAppletCommandSendable<TCommandPayload>,
	): Promise<IAppletCommand<TCommandPayload>> {
		const response = await postResource(this.options, AppletCommandManagement.getResource(deviceUid, appletUid), JSON.stringify(settings));
		const body = await response.text();
		if (response.status === 202) {
			const responseLocation = response.headers.get('location')!;
			const commandUid = responseLocation.substring(responseLocation.lastIndexOf('/') + 1);
			while (true) {
				await wait(500);
				try {
					return await this.get<TCommandPayload>(deviceUid, appletUid, commandUid);
				} catch {
					// when 404 command does not exist yet
				}
			}
		} else {
			throw new RequestError(response.status, body);
		}
	}

	private static getResource(deviceUid: string, appletUid: string): string {
		return `${Resources.Device}/${deviceUid}/${APPLET}/${appletUid}/command`;
	}
}
