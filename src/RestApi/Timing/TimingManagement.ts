import wait from '../../Timer/wait';
import { postResource, putResource, deleteResource, getResource, parseJSONResponse } from '../requester';
import { Dependencies } from '../Dependencies';
import ITiming, { ITimingUpdatable, ITimingCreateOnly } from './ITiming';
import UnsupportedError from '../Error/UnsupportedError';
import ITimingFilter from './ITimingFilter';
import Timing from './Timing';
import { isEqual } from 'lodash';
import AppletCommandManagement from '../Applet/Command/AppletCommandManagement';
import { areConfigurationsEqual } from './compareTimings';

interface ValidateDataValues {
	configuration?: boolean;
	dataValues?: boolean;
}

export default class TimingManagement {
	public readonly DURATION: string = 'DURATION';
	public readonly SCREEN_TAP: string = 'SCREEN_TAP';
	public readonly IDLE_TIMEOUT: string = 'IDLE_TIMEOUT';

	private static readonly RESOURCE: string = 'timing';

	private readonly appletCommandManagement: AppletCommandManagement;

	constructor(private readonly dependencies: Dependencies) {
		this.appletCommandManagement = new AppletCommandManagement(dependencies);
	}

	public async create(data: ITimingCreateOnly & ITimingUpdatable): Promise<Timing> {
		this.assertV1();

		await postResource(this.dependencies.options, TimingManagement.RESOURCE, JSON.stringify(data));
		// v1 does not respond created uid
		let timing: Timing | undefined;
		do {
			await wait(500);
			const timings = await this.getList({ deviceUid: data.deviceUid });
			timing = timings.find((t: Timing) => this.areDataSame(t, data, { configuration: true, dataValues: true }));
		} while (!timing);

		return timing;
	}

	public async update(timingUid: string, data: ITimingUpdatable): Promise<Timing> {
		this.assertV1();

		await putResource(this.dependencies.options, TimingManagement.RESOURCE + '/' + timingUid, JSON.stringify(data));
		// v1 does not respond created uid
		let timing: Timing;
		do {
			await wait(500);
			timing = await this.get(timingUid);
		} while (!this.areDataSame(timing, { ...data, appletUid: timing.appletUid, deviceUid: timing.deviceUid }));

		return timing;
	}

	public async delete(timingUid: string) {
		await deleteResource(this.dependencies.options, TimingManagement.RESOURCE + '/' + timingUid);
	}

	public async getList(filter: ITimingFilter = {}): Promise<Timing[]> {
		const response = await getResource(this.dependencies.options, TimingManagement.RESOURCE, filter);
		const timingsData: ITiming[] = await parseJSONResponse(response);

		return timingsData.map((timingData: ITiming) => new Timing(timingData, this, this.appletCommandManagement));
	}

	public async get(timingUid: string): Promise<Timing> {
		const response = await getResource(this.dependencies.options, TimingManagement.RESOURCE + '/' + timingUid);

		return new Timing(await parseJSONResponse(response), this, this.appletCommandManagement);
	}

	private assertV1(): void {
		if (this.dependencies.options.version !== 'v1') {
			throw new UnsupportedError(`API version ${this.dependencies.options.version} is not implemented`);
		}
	}

	private areDataSame(
		t1: ITimingCreateOnly & ITimingUpdatable,
		t2: ITimingCreateOnly & ITimingUpdatable,
		additionalValidation?: ValidateDataValues,
	) {
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
		// When we are updating timing, configuration might change, so we need to check it always
		if (additionalValidation?.configuration) {
			if (!areConfigurationsEqual(t1.configuration, t2.configuration)) {
				return false;
			}
		}
		if (additionalValidation?.dataValues) {
			if (!isEqual(t1.finishEvent.data, t2.finishEvent.data)) {
				return false;
			}
		}
		return true;
	}
}
