import { IPaginationAndSort } from '../../../Lib/Pagination/pagination';
import { postResource, getResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import IDevice from '../IDevice';
import DeviceScreenshot, { IDeviceScreenshot } from './DeviceScreenshot';

interface ILastScreenshotsByDevicesParams extends IPaginationAndSort {
	filter?: { deviceUids?: IDevice['uid'][] };
}

interface IDeviceScreenshotFilter {
	takenSince?: Date;
	takenUntil?: Date;
	limit?: number;
	descending?: boolean;
}

export default class DeviceScreenshotManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/screenshot`;
	}

	constructor(private options: IOptions) {}

	public async listLastScreenshotsByDevices({ filter, sort, pagination }: ILastScreenshotsByDevicesParams) {
		const lastScreenshots = await getResource(this.options, `${Resources.Device}/screenshot`, {
			...(filter ?? {}),
			...(sort ?? {}),
			...(pagination ?? {}),
		});
		const lastScreenshotsParsed: IDeviceScreenshot[] = await parseJSONResponse(lastScreenshots);

		return lastScreenshotsParsed.map((lastScreenshot) => new DeviceScreenshot(lastScreenshot));
	}

	public async take(deviceUid: string) {
		await postResource(this.options, DeviceScreenshotManagement.getUrl(deviceUid), undefined);
	}

	public async getList(deviceUid: string, filter: IDeviceScreenshotFilter = {}): Promise<IDeviceScreenshot[]> {
		const response = await getResource(this.options, DeviceScreenshotManagement.getUrl(deviceUid), filter);
		const screenshotsData: IDeviceScreenshot[] = await parseJSONResponse(response);

		return screenshotsData.map((screenshotData: IDeviceScreenshot) => new DeviceScreenshot(screenshotData));
	}
}
