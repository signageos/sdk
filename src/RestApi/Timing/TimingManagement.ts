
import wait from '../../Timer/wait';
import { postResource, putResource, deleteResource, getResource, deserializeJSON } from '../helper';
import IOptions from "../IOptions";
import ITiming, { ITimingUpdatable, ITimingCreateOnly } from "./ITiming";
import RequestError from '../Error/RequestError';
import UnsupportedError from '../Error/UnsupportedError';
import ITimingFilter from './ITimingFilter';
import Timing from './Timing';
import TimingCommandManagement from './Command/TimingCommandManagement';

export default class TimingManagement {

	private static readonly RESOURCE: string = 'timing';

	public readonly DURATION: string = 'DURATION';
	public readonly SCREEN_TAP: string = 'SCREEN_TAP';
	public readonly IDLE_TIMEOUT: string = 'IDLE_TIMEOUT';

	private timingCommandManagement: TimingCommandManagement = new TimingCommandManagement(this.options);

	constructor(private options: IOptions) {}

	public async create(data: ITimingCreateOnly & ITimingUpdatable) {
		if (this.options.version === 'v1') {
			const response = await postResource(this.options, TimingManagement.RESOURCE, data);
			const body = await response.text();
			if (response.status === 200) {
				// v1 does not respond created uid
				let timing: Timing | undefined;
				do {
					await wait(500);
					const timings = await this.getList({ deviceUid: data.deviceUid });
					timing = timings.find((t: Timing) => this.areDataSame(t, data));
				} while (!timing);
				return timing;
			} else {
				throw new RequestError(response.status, body);
			}
		} else {
			throw new UnsupportedError(`API version ${this.options.version} is not implemented`);
		}
	}

	public async update(timingUid: string, data: ITimingUpdatable) {
		if (this.options.version === 'v1') {
			const response = await putResource(this.options, TimingManagement.RESOURCE + '/' + timingUid, data);
			const body = await response.text();
			if (response.status === 200) {
				// v1 does not respond created uid
				let timing: Timing;
				do {
					await wait(500);
					timing = await this.get(timingUid);
				} while (!this.areDataSame(timing, { ...data, appletUid: timing.appletUid, deviceUid: timing.deviceUid }));
				return timing;
			} else {
				throw new RequestError(response.status, body);
			}
		} else {
			throw new UnsupportedError(`API version ${this.options.version} is not implemented`);
		}
	}

	public async delete(timingUid: string) {
		const response = await deleteResource(this.options, TimingManagement.RESOURCE + '/' + timingUid);
		const body = await response.text();
		if (response.status !== 200) {
			throw new RequestError(response.status, body);
		}
	}

	public async getList(filter: ITimingFilter = {}) {
		const response = await getResource(this.options, TimingManagement.RESOURCE, filter);
		const timingsData: ITiming[] = JSON.parse(await response.text(), deserializeJSON);
		if (response.status === 200) {
			return timingsData.map((timingData: ITiming) => new Timing(timingData, this, this.timingCommandManagement));
		} else {
			throw new RequestError(response.status, timingsData);
		}
	}

	public async get(timingUid: string) {
		const response = await getResource(this.options, TimingManagement.RESOURCE + '/' + timingUid);
		const timingData: ITiming = JSON.parse(await response.text(), deserializeJSON);
		if (response.status === 200) {
			return new Timing(timingData, this, this.timingCommandManagement);
		} else {
			throw new RequestError(response.status, timingData);
		}
	}

	private areDataSame(t1: ITimingCreateOnly & ITimingUpdatable, t2: ITimingCreateOnly & ITimingUpdatable) {
		if (t1.appletUid !== t2.appletUid) {
			return false;
		}
		if (t1.appletVersion !== t2.appletVersion) {
			return false;
		}
		if (t1.deviceUid !== t2.deviceUid) {
			return false;
		}
		if (t1.startsAt.valueOf() !== t2.startsAt.valueOf()) {
			return false;
		}
		if (t1.endsAt.valueOf() !== t2.endsAt.valueOf()) {
			return false;
		}
		if (t1.position !== t2.position) {
			return false;
		}
		if (t1.finishEvent.type !== t2.finishEvent.type) {
			return false;
		}
		if (t1.finishEvent.data !== t2.finishEvent.data) {
			return false;
		}
		if (JSON.stringify(t1.configuration) !== JSON.stringify(t2.configuration)) {
			return false;
		}
		return true;
	}
}
