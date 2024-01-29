import { getResource, parseJSONResponse, putResource } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import DeviceAppletTest from './DeviceAppletTest';
import IDeviceAppletTest from './IDeviceAppletTest';

export default class DeviceAppletTestManagement {
	private static getUrl(deviceUid: string, appletUid: string, appletVersion: string): string {
		return `${Resources.Device}/${deviceUid}/applet-test/${appletUid}/${appletVersion}`;
	}

	constructor(private options: IOptions) {}

	public async get(deviceUid: string, appletUid: string, appletVersion: string): Promise<IDeviceAppletTest> {
		const response = await getResource(this.options, DeviceAppletTestManagement.getUrl(deviceUid, appletUid, appletVersion));
		const data: IDeviceAppletTest = await parseJSONResponse(response);

		return new DeviceAppletTest(data);
	}

	public async run(deviceUid: string, appletUid: string, appletVersion: string, tests: string[]): Promise<void> {
		await putResource(this.options, DeviceAppletTestManagement.getUrl(deviceUid, appletUid, appletVersion), JSON.stringify({ tests }));
	}
}
