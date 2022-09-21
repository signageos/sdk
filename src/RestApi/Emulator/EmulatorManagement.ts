import { getResource, postResource, deleteResource, parseJSONResponse } from '../requester';
import IOptions from "../IOptions";
import IEmulator, { IEmulatorCreatable } from './IEmulator';
import Emulator from './Emulator';
import { IEmulatorFilter } from './IEmulatorFilter';

export default class EmulatorManagement {
	public static readonly RESOURCE: string = 'emulator';

	constructor(private options: IOptions) {}

	public async list(filter?: IEmulatorFilter) {
		const response = await getResource(this.options, EmulatorManagement.RESOURCE, filter);
		const data: IEmulator[] = await parseJSONResponse(response);
		return data.map((item: IEmulator) => new Emulator(item));
	}

	public async create(settings: IEmulatorCreatable): Promise<void> {
		await postResource(this.options, EmulatorManagement.RESOURCE, JSON.stringify(settings));
	}

	public async delete(deviceUid: string): Promise<void> {
		await deleteResource(this.options, EmulatorManagement.RESOURCE + '/' + deviceUid);
	}
}
