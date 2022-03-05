import IOptions from '../../IOptions';
import { getResource, parseJSONResponse } from '../../requester';
import { Resources } from "../../resources";
import IDevicePolicyStatusFilter from './IDevicePolicyStatusFilter';
import IDevicePolicyStatus from './IDevicePolicyStatus';
import DevicePolicyStatus from './DevicePolicyStatus';

export default class DevicePolicyStatusManagement {
	public static readonly RESOURCE: string = 'policy-status';

	constructor(private options: IOptions) {}

	public async list(deviceUid: string, filter: Partial<IDevicePolicyStatusFilter>): Promise<DevicePolicyStatus[]> {
		const urlParts = [Resources.Device, deviceUid, DevicePolicyStatusManagement.RESOURCE];
		const response = await getResource(this.options, urlParts.join('/'), filter);
		const data: IDevicePolicyStatus[] = await parseJSONResponse(response);
		return data.map((item: IDevicePolicyStatus) => new DevicePolicyStatus(item));
	}

	public async get(deviceUid: string, { policyUid, itemType }: IDevicePolicyStatusFilter): Promise<DevicePolicyStatus> {
		const urlParts = [Resources.Device, deviceUid, DevicePolicyStatusManagement.RESOURCE, policyUid, 'item', itemType];
		const response = await getResource(this.options, urlParts.join('/'));
		return new DevicePolicyStatus(await parseJSONResponse(response));
	}
}
