import { getResource, parseJSONResponse, postResource } from "../../requester";
import { Resources } from "../../resources";
import IOptions from "../../IOptions";
import IReportFile from "./ReportFile/IReportFile";
import ReportFile from "./ReportFile/ReportFile";
import IStorageStatus from "./Storage/IStorageStatus";
import StorageStatus from "./Storage/StorageStatus";
import ITemperature from "./Temperature/ITemperature";
import Temperature from "./Temperature/Temperature";
import IHourlyStatus from "./HourlyStatus/IHourlyStatus";
import HourlyStatus from "./HourlyStatus/HourlyStatus";
import { ICreatedDateRangeFilter, IDateRangeFilter, ITakenDateRangeFilter } from "./ICreatedDateRangeFilter";
import IScreenshot from "./Screenshot/IScreenshot";
import Screenshot from "./Screenshot/Screenshot";

export default class DeviceMonitoringManagement {

	private static getUrl(deviceUid: string, resource: string): string {
		return `${Resources.Device}/${deviceUid}/${resource}`;
	}

	constructor(private options: IOptions) {
	}

	public async takeScreenshot(deviceUid: string): Promise<void> {
		await postResource(this.options, DeviceMonitoringManagement.getUrl(deviceUid, 'screenshot'), JSON.stringify({}));
	}

	public async screenshots(deviceUid: string, filter: ITakenDateRangeFilter = {}): Promise<IScreenshot[]> {
		const response = await getResource(this.options, DeviceMonitoringManagement.getUrl(deviceUid, 'screenshot'), filter);
		const data: IScreenshot[] = await parseJSONResponse(response);

		return data.map((item: IScreenshot) => new Screenshot(item));
	}

	public async hourlyStatuses(deviceUid: string, filter: IDateRangeFilter = {}): Promise<IHourlyStatus[]> {
		const response = await getResource(this.options, DeviceMonitoringManagement.getUrl(deviceUid, 'hourly-connected-status'), filter);
		const data: IHourlyStatus[] = await parseJSONResponse(response);

		return data.map((item: IHourlyStatus) => new HourlyStatus(item));
	}

	public async temperatures(deviceUid: string, filter: ICreatedDateRangeFilter = {}): Promise<ITemperature[]> {
		const response = await getResource(this.options, DeviceMonitoringManagement.getUrl(deviceUid, 'temperature'), filter);
		const data: ITemperature[] = await parseJSONResponse(response);

		return data.map((item: ITemperature) => new Temperature(item));
	}

	public async storage(deviceUid: string): Promise<IStorageStatus> {
		const response = await getResource(this.options, DeviceMonitoringManagement.getUrl(deviceUid, 'storage'));

		return new StorageStatus(await parseJSONResponse(response));
	}

	public async reports(deviceUid: string, filter: ICreatedDateRangeFilter = {}): Promise<IReportFile[]> {
		const response = await getResource(this.options, DeviceMonitoringManagement.getUrl(deviceUid, 'report'), filter);
		const data: IReportFile[] = await parseJSONResponse(response);

		return data.map((item: IReportFile) => new ReportFile(item));
	}

}
