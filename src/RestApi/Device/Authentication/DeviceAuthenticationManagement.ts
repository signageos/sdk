import { getResource, parseJSONResponse } from '../../requester';
import { Resources } from '../../resources';
import IOptions from '../../IOptions';
import IDeviceAuthentication from './IDeviceAuthentication';
import DeviceAuthentication from './DeviceAuthentication';

export default class DeviceAuthenticationManagement {
	private static getUrl(deviceUid: string): string {
		return `${Resources.Device}/${deviceUid}/authentication`;
	}

	private static getUrlByAuthHash(authHash: string): string {
		return `${Resources.Device}/authentication/${authHash}`;
	}

	constructor(private options: IOptions) {}

	public async get(deviceUid: string): Promise<IDeviceAuthentication> {
		const response = await getResource(this.options, DeviceAuthenticationManagement.getUrl(deviceUid));

		return new DeviceAuthentication(await parseJSONResponse(response));
	}

	public async getByAuthHash(authHash: string): Promise<IDeviceAuthentication> {
		const response = await getResource(this.options, DeviceAuthenticationManagement.getUrlByAuthHash(authHash));

		return new DeviceAuthentication(await parseJSONResponse(response));
	}
}
