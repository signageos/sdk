import DeviceManagement from './V2/Device/DeviceManagement';
import IOptions from './IOptions';

export default class RestApiV2 {
	public readonly device: DeviceManagement = new DeviceManagement(this.organizationOptions);

	constructor(public readonly accountOptions: IOptions, public readonly organizationOptions: IOptions) {}
}
