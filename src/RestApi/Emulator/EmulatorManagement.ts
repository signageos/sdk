import { getResource, postResource, deleteResource, parseJSONResponse } from '../requester';
import IOptions from '../IOptions';
import IEmulator, { IEmulatorCreatable } from './IEmulator';
import Emulator from './Emulator';
import { IEmulatorFilter } from './IEmulatorFilter';
import DeviceManagement from '../Device/DeviceManagement';
import IDevice from '../Device/IDevice';

export default class EmulatorManagement {
	public static readonly RESOURCE: string = 'emulator';

	constructor(
		private options: IOptions,
		private deviceManagement: DeviceManagement,
	) {}

	public async list(filter?: IEmulatorFilter) {
		const response = await getResource(this.options, EmulatorManagement.RESOURCE, filter);
		const data: IEmulator[] = await parseJSONResponse(response);
		return data.map((item: IEmulator) => new Emulator(item));
	}

	public async create(settings: IEmulatorCreatable): Promise<IDevice> {
		const response = await postResource(this.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = response.headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${EmulatorManagement.RESOURCE}.`);
		}
		const deviceUid = headerLocation.split('/').slice(-1)[0];
		return await this.deviceManagement.get(deviceUid);
	}

	public async createWithoutProvision(settings: IEmulatorCreatable): Promise<{ device: IDevice; verificationHash: string }> {
		const response = await postResource(this.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = response.headers.get('location');
		const body = await response.json();

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${EmulatorManagement.RESOURCE}.`);
		}
		const deviceUid = headerLocation.split('/').slice(-1)[0];
		const device = await this.deviceManagement.get(deviceUid);

		return {
			device,
			verificationHash: body.verificationHash,
		};
	}

	public async delete(deviceUid: string): Promise<void> {
		await deleteResource(this.options, EmulatorManagement.RESOURCE + '/' + deviceUid);
	}
}
