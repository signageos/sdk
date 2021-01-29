import { postResource, getResource, parseJSONResponse } from '../../requester';
import { RESOURCE as DEVICE } from "../DeviceManagement";
import IOptions from "../../IOptions";
import IDeviceScreenshot from './IDeviceScreenshot';
import IDeviceScreenshotFilter from './IDeviceScreenshotFilter';
import DeviceScreenshot from './DeviceScreenshot';

export default class DeviceScreenshotManagement {

	private static getUrl(deviceUid: string): string {
		return `${DEVICE}/${deviceUid}/screenshot`;
	}

	constructor(private options: IOptions) {}

	public async take(deviceUid: string) {
		await postResource(this.options, DeviceScreenshotManagement.getUrl(deviceUid), undefined);
	}

	public async getList(deviceUid: string, filter: IDeviceScreenshotFilter = {}): Promise<IDeviceScreenshot[]> {
		const response = await getResource(this.options, DeviceScreenshotManagement.getUrl(deviceUid), filter);
		const screenshotsData: IDeviceScreenshot[] = await parseJSONResponse(response);

		return screenshotsData.map((screenshotData: IDeviceScreenshot) => new DeviceScreenshot(screenshotData));
	}
}
