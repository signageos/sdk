import {getResource, parseJSONResponse, putResource} from "../../requester";
import DeviceManagement from "../DeviceManagement";
import IDeviceVolume, {IDeviceVolumeUpdatable} from "./IDeviceVolume";
import DeviceVolume from "./DeviceVolume";
import IOptions from "../../IOptions";
import RequestError from "../../Error/RequestError";

export default class DeviceVolumeManagement {

	private static getUrl(deviceUid: string): string {
		return `${DeviceManagement.RESOURCE}/${deviceUid}/volume`;
	}

	constructor(private options: IOptions) {
	}

	public async get(deviceUid: string): Promise<IDeviceVolume> {
		const response = await getResource(this.options, DeviceVolumeManagement.getUrl(deviceUid));

		return new DeviceVolume(await parseJSONResponse(response));
	}

	public async set(deviceUid: string, settings: IDeviceVolumeUpdatable): Promise<number> {
		const response = await putResource(this.options, DeviceVolumeManagement.getUrl(deviceUid), settings);
		const data = await parseJSONResponse(response);
		if (!data.volume) {
			throw new RequestError(response.status, 'Missing "volume" field in response JSON');
		}

		return data.volume;
	}

}
