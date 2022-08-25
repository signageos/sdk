import { IPaginationAndSort } from '../../../Lib/Pagination/pagination';
import { getResource, parseJSONResponse } from '../../requester';
import IOptions from '../../IOptions';
import { Resources } from '../../resources';
import IDevice from '../IDevice';
import DeviceTelemetry from './DeviceTelemetry';
import { DeviceTelemetryType } from './IDeviceTelemetry';
import DeviceTelemetryLatest, { TTelemetriesByDevice } from './DeviceTelemetryLatest';

interface IDeviceTelemetryFilter {
	deviceUids?: IDevice['uid'][];
}

interface IDeviceTelemetriesLatest extends IPaginationAndSort {
	filter?: IDeviceTelemetryFilter;
}

interface IDeviceTelemetryLatest {
	uid: IDevice['uid'];
}

export default class DeviceTelemetryManagement {
	constructor(private options: IOptions) {}

	/**
	 * Get one latest by uid and type
	 */
	public async getLatest(deviceUid: string, type: DeviceTelemetryType) {
		const urlParts = [Resources.Device, deviceUid, Resources.DeviceTelemetry, type, 'latest'];
		const response = await getResource(this.options, urlParts.join('/'));

		return new DeviceTelemetry(await parseJSONResponse(response));
	}

	public async listLatest({ filter, sort, pagination }: IDeviceTelemetriesLatest): Promise<TTelemetriesByDevice[]> {
		const devicesLatestRaw = await getResource(this.options, `${Resources.Device}/telemetry/latest`, {
			...(filter ?? {}),
			...(sort ?? {}),
			...(pagination ?? {}),
		});
		const devicesLatestParsed: TTelemetriesByDevice[] = await parseJSONResponse(devicesLatestRaw);

		return devicesLatestParsed.map((deviceLatest) => new DeviceTelemetryLatest(deviceLatest));
	}

	/**
	 * Get one latest by uid
	 */
	public async getLatestByUid({ uid }: IDeviceTelemetryLatest) {
		const deviceLatestRaw = await getResource(this.options, `${Resources.Device}/${uid}/telemetry/latest`, {});
		const deviceLatestParsed: TTelemetriesByDevice = await parseJSONResponse(deviceLatestRaw);

		return new DeviceTelemetryLatest(deviceLatestParsed);
	}
}
