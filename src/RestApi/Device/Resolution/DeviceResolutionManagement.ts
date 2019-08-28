import {getResource, parseJSONResponse, putResource} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IDeviceResolution, {IDeviceResolutionUpdatable} from "./IDeviceResolution";
import DeviceResolution from "./DeviceResolution";
import IOptions from "../../IOptions";

export default class DeviceResolutionManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/resolution`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceResolution> {
		const response = await getResource(this.options, DeviceResolutionManagement.getUrl(deviceUid));

		return new DeviceResolution(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceResolutionUpdatable): Promise<void> {
		await putResource(this.options, DeviceResolutionManagement.getUrl(deviceUid), settings);
	}

}
