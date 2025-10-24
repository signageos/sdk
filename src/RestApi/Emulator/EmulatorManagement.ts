import { getResource, postResource, deleteResource, parseJSONResponse } from '../requester';
import { Dependencies } from '../Dependencies';
import IEmulator, { IEmulatorCreatable } from './IEmulator';
import Emulator from './Emulator';
import { IEmulatorFilter } from './IEmulatorFilter';
import IDevice from '../Device/IDevice';
import Device from '../Device/Device';
import { PaginatedList } from '../../Lib/Pagination/PaginatedList';

export default class EmulatorManagement {
	public static readonly RESOURCE: string = 'emulator';

	constructor(private readonly dependencies: Dependencies) {}

	public async list(filter?: IEmulatorFilter): Promise<PaginatedList<Emulator>> {
		const response = await getResource(this.dependencies.options, EmulatorManagement.RESOURCE, filter);
		return this.dependencies.paginator.getPaginatedListFromResponse(response, (item: IEmulator) => new Emulator(item));
	}

	public async create(settings: IEmulatorCreatable): Promise<IDevice> {
		const response = await postResource(this.dependencies.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = response.headers.get('location');

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${EmulatorManagement.RESOURCE}.`);
		}
		const deviceUid = headerLocation.split('/').slice(-1)[0];
		const deviceResponse = await getResource(this.dependencies.options, `device/${deviceUid}`);
		const deviceData: IDevice = await parseJSONResponse(deviceResponse);
		return new Device(deviceData);
	}

	public async createWithoutProvision(settings: IEmulatorCreatable): Promise<{ device: IDevice; verificationHash: string }> {
		const response = await postResource(this.dependencies.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
		const headerLocation = response.headers.get('location');
		const body = await response.json();

		if (!headerLocation) {
			throw new Error(`Api didn't return location header to created ${EmulatorManagement.RESOURCE}.`);
		}
		const deviceUid = headerLocation.split('/').slice(-1)[0];
		const deviceResponse = await getResource(this.dependencies.options, `device/${deviceUid}`);
		const deviceData: IDevice = await parseJSONResponse(deviceResponse);
		const device = new Device(deviceData);

		return {
			device,
			verificationHash: body.verificationHash,
		};
	}

	public async delete(deviceUid: string): Promise<void> {
		await deleteResource(this.dependencies.options, EmulatorManagement.RESOURCE + '/' + deviceUid);
	}
}
