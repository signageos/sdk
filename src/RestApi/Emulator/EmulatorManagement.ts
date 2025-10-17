import { getResource, postResource, deleteResource, parseJSONResponse } from '../requester';
import IOptions from '../IOptions';
import IEmulator, { IEmulatorCreatable } from './IEmulator';
import Emulator from './Emulator';
import { IEmulatorFilter } from './IEmulatorFilter';
import IDevice from '../Device/IDevice';
import Device from '../Device/Device';

export default class EmulatorManagement {
	public static readonly RESOURCE: string = 'emulator';

	constructor(private options: IOptions) {}

	public async list(filter?: IEmulatorFilter) {
		const response = await getResource(this.options, EmulatorManagement.RESOURCE, filter);
		const data: IEmulator[] | null = await parseJSONResponse(response);
		// API may return null instead of empty array when there are no results
		if (!data) {
			return [];
		}
		return data.map((item: IEmulator) => new Emulator(item));
	}

	public async create(settings: IEmulatorCreatable): Promise<IDevice> {
		const response = await postResource(this.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = response.headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${EmulatorManagement.RESOURCE}.`);
		}
		const deviceUid = headerLocation.split('/').slice(-1)[0];
		const deviceResponse = await getResource(this.options, `device/${deviceUid}`);
		const deviceData: IDevice = await parseJSONResponse(deviceResponse);
		return new Device(deviceData);
	}

	public async createWithoutProvision(settings: IEmulatorCreatable): Promise<{ device: IDevice; verificationHash: string }> {
		const response = await postResource(this.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = response.headers.get('location');
		const body = await response.json();

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${EmulatorManagement.RESOURCE}.`);
		}
		const deviceUid = headerLocation.split('/').slice(-1)[0];
		const deviceResponse = await getResource(this.options, `device/${deviceUid}`);
		const deviceData: IDevice = await parseJSONResponse(deviceResponse);
		const device = new Device(deviceData);

		return {
			device,
			verificationHash: body.verificationHash,
		};
	}

	public async delete(deviceUid: string): Promise<void> {
		await deleteResource(this.options, EmulatorManagement.RESOURCE + '/' + deviceUid);
	}
}
