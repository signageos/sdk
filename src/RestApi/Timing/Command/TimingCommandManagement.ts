import { getResource, postResource, parseJSONResponse } from '../../requester';
import IOptions from '../../IOptions';
import ITimingCommand, { ITimingCommandPayload, ITimingCommandCreateOnly } from './ITimingCommand';
import RequestError from '../../Error/RequestError';
import ITimingCommandFilter from './ITimingCommandFilter';
import TimingCommand from './TimingCommand';
import wait from '../../../Timer/wait';
import UnsupportedError from '../../Error/UnsupportedError';

/** @deprecated duplicate implementation, use AppletCommandManagement */
export default class TimingCommandManagement {
	private static readonly RESOURCE: string[] = ['device', 'applet', 'command'];

	public readonly DURATION: string = 'DURATION';
	public readonly SCREEN_TAP: string = 'SCREEN_TAP';
	public readonly IDLE_TIMEOUT: string = 'IDLE_TIMEOUT';

	constructor(private options: IOptions) {}

	/** @deprecated duplicate implementation, use AppletCommandManagement.list() */
	public async getList<TCommandPayload extends ITimingCommandPayload>(filter: ITimingCommandFilter) {
		const response = await getResource(
			this.options,
			TimingCommandManagement.RESOURCE[0] +
				'/' +
				filter.deviceUid +
				'/' +
				TimingCommandManagement.RESOURCE[1] +
				(filter.appletUid ? '/' + filter.appletUid : '') +
				'/' +
				TimingCommandManagement.RESOURCE[2],
			filter,
		);
		const timingCommandsData: ITimingCommand<TCommandPayload>[] = await parseJSONResponse(response);
		if (response.status === 200) {
			return timingCommandsData.map(
				(timingCommandData: ITimingCommand<TCommandPayload>) => new TimingCommand<TCommandPayload>(timingCommandData),
			);
		} else {
			throw new RequestError(response.status, timingCommandsData);
		}
	}

	/** @deprecated duplicate implementation, use AppletCommandManagement.get() */
	public async get<TCommandPayload extends ITimingCommandPayload>(deviceUid: string, appletUid: string, timingCommandUid: string) {
		const response = await getResource(
			this.options,
			TimingCommandManagement.RESOURCE[0] +
				'/' +
				deviceUid +
				'/' +
				TimingCommandManagement.RESOURCE[1] +
				'/' +
				appletUid +
				'/' +
				TimingCommandManagement.RESOURCE[2] +
				'/' +
				timingCommandUid,
		);
		const timingCommandData: ITimingCommand<TCommandPayload> = await parseJSONResponse(response);
		if (response.status === 200) {
			return new TimingCommand<TCommandPayload>(timingCommandData);
		} else {
			throw new RequestError(response.status, timingCommandData);
		}
	}

	/** @deprecated duplicate implementation, use AppletCommandManagement.send() */
	public async create<TCommandPayload extends ITimingCommandPayload>(timingCommandData: ITimingCommandCreateOnly<TCommandPayload>) {
		if (this.options.version === 'v1') {
			const response = await postResource(
				this.options,
				TimingCommandManagement.RESOURCE[0] +
					'/' +
					timingCommandData.deviceUid +
					'/' +
					TimingCommandManagement.RESOURCE[1] +
					'/' +
					timingCommandData.appletUid +
					'/' +
					TimingCommandManagement.RESOURCE[2],
				JSON.stringify(timingCommandData),
			);
			const body = await response.text();
			if (response.status === 202) {
				const responseLocation = response.headers.get('location')!;
				const timingCommandUid = responseLocation.substring(responseLocation.lastIndexOf('/') + 1);
				// v1 will create request in background
				while (true) {
					await wait(500);
					try {
						const timingCommand = await this.get<TCommandPayload>(
							timingCommandData.deviceUid,
							timingCommandData.appletUid,
							timingCommandUid,
						);
						return timingCommand;
					} catch (error) {
						// when 404 command does not exists yet
					}
				}
			} else {
				throw new RequestError(response.status, body);
			}
		} else {
			throw new UnsupportedError(`API version ${this.options.version} is not implemented`);
		}
	}
}
